import io
import pickle
import numpy as np
import cv2
import matplotlib
matplotlib.use('Agg') # Configurar el backend antes de importar pyplot

import matplotlib.pyplot as plt
import torch
import warnings
import typing
import logging
import os
import platform
import glob
import PIL
import facenet_pytorch
from typing import Union, Dict
from PIL import Image
from facenet_pytorch import MTCNN
from facenet_pytorch import InceptionResnetV1
from urllib.request import urlretrieve
from tqdm import tqdm
from scipy.spatial.distance import euclidean
from scipy.spatial.distance import cosine
import zipfile
import datetime

from neuralnetwork.dataprocess.s3_helper import get_s3_client, download_file_from_s3, upload_file_to_s3

def detectar_caras(
  imagen: Union[PIL.Image.Image, np.ndarray],
  detector: facenet_pytorch.models.mtcnn.MTCNN=None,
  keep_all: bool        = True,
  min_face_size: int    = 20,
  thresholds: list      = [0.6, 0.7, 0.7],
  device: str           = None,
  min_confidence: float = 0.5,
  fix_bbox: bool        = True,
  verbose               = False
  )-> np.ndarray:
    if not isinstance(imagen, (np.ndarray, PIL.Image.Image)):
        raise Exception(
        f"`imagen` debe ser `np.ndarray, PIL.Image`. Recibido {type(imagen)}."
        )
    if detector is None:
        print('Iniciando detector MTCC')
        detector = MTCNN(
        keep_all      = keep_all,
        min_face_size = min_face_size,
        thresholds    = thresholds,
        post_process  = False,
        device        = device
        )

     # Convertir imagen a RGB si tiene 4 canales (RGBA)

    if isinstance(imagen, PIL.Image.Image):
        if imagen.mode == 'RGBA':
            imagen = imagen.convert('RGB')
        imagen = np.array(imagen).astype(np.float32)       

    bboxes, probs = detector.detect(imagen, landmarks=False)

    if bboxes is None:
        bboxes = np.array([])
        probs  = np.array([])
    else:
        bboxes = bboxes[probs > min_confidence]
        probs  = probs[probs > min_confidence]

    print(f'Número total de caras detectadas: {len(bboxes)}')
    print(f'Número final de caras seleccionadas: {len(bboxes)}')

    if len(bboxes) > 0 and fix_bbox:
        for i, bbox in enumerate(bboxes):
            if bbox[0] < 0:
                bboxes[i][0] = 0
            if bbox[1] < 0:
                bboxes[i][1] = 0
            if bbox[2] > imagen.shape[1]:
                bboxes[i][2] = imagen.shape[1]
            if bbox[3] > imagen.shape[0]:
                bboxes[i][3] = imagen.shape[0]

    if verbose:
        print("----------------")
        print("Imagen escaneada")
        print("----------------")
        print(f"Caras detectadas: {len(bboxes)}")
        print(f"Correción bounding boxes: {fix_bbox}")
        print(f"Coordenadas bounding boxes: {bboxes}")
        print(f"Confianza bounding boxes:{probs} ")
        print("")

    return bboxes.astype(int)

def mostrar_bboxes(
    imagen: Union[PIL.Image.Image, np.ndarray],
    bboxes: np.ndarray,
    identidades: list=None,
    ax=None
    ) -> bytes:
    if not isinstance(imagen, (np.ndarray, PIL.Image.Image)):
        raise Exception(
            f"`imagen` debe ser `np.ndarray, PIL.Image`. Recibido {type(imagen)}."
        )

    if identidades is not None:
        if len(bboxes) != len(identidades):
            raise Exception(
                '`identidades` debe tener el mismo número de elementos que `bboxes`.'
            )
    else:
        identidades = [None] * len(bboxes)

    fig, ax = plt.subplots()

    if isinstance(imagen, PIL.Image.Image):
        imagen = np.array(imagen).astype(np.float32) / 255

    ax.imshow(imagen)
    ax.axis('off')

    if len(bboxes) > 0:
        for i, bbox in enumerate(bboxes):
            if identidades[i] is not None:
                rect = plt.Rectangle(
                xy        = (bbox[0], bbox[1]),
                width     = bbox[2] - bbox[0],
                height    = bbox[3] - bbox[1],
                linewidth = 1,
                edgecolor = 'lime',
                facecolor = 'none'
                )
                ax.add_patch(rect)
                ax.text(
                x = bbox[0],
                y = bbox[1] -10,
                s = identidades[i],
                fontsize = 10,
                color    = 'lime'
                )
            else:
                rect = plt.Rectangle(
                xy        = (bbox[0], bbox[1]),
                width     = bbox[2] - bbox[0],
                height    = bbox[3] - bbox[1],
                linewidth = 1,
                edgecolor = 'red',
                facecolor = 'none'
                )
                ax.add_patch(rect)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return buf.getvalue()

def mostrar_bboxes_cv2(
    imagen: Union[PIL.Image.Image, np.ndarray],
    bboxes: np.ndarray,
    identidades: list = None,
    device: str = 'window'
) -> bytes:  # Cambiar el tipo de retorno a bytes

    # Comprobaciones iniciales
    if not isinstance(imagen, (np.ndarray, PIL.Image.Image)):
        raise Exception(
            f"`imagen` debe ser `np.ndarray`, `PIL.Image`. Recibido {type(imagen)}."
        )

    if identidades is not None:
        if len(bboxes) != len(identidades):
            raise Exception(
                '`identidades` debe tener el mismo número de elementos que `bboxes`.'
            )
    else:
        identidades = [None] * len(bboxes)

    # Mostrar la imagen y superponer bounding boxes
    if isinstance(imagen, PIL.Image.Image):
        imagen = np.array(imagen).astype(np.uint8)

    if len(bboxes) > 0:
        for i, bbox in enumerate(bboxes):
            if identidades[i] is not None:
                cv2.rectangle(
                    img=imagen,
                    pt1=(bbox[0], bbox[1]),
                    pt2=(bbox[2], bbox[3]),
                    color=(0, 255, 0),
                    thickness=2
                )

                cv2.putText(
                    img=imagen,
                    text=identidades[i],
                    org=(bbox[0], bbox[1] - 10),
                    fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                    fontScale=1e-3 * imagen.shape[0],
                    color=(0, 255, 0),
                    thickness=2
                )
            else:
                cv2.rectangle(
                    img=imagen,
                    pt1=(bbox[0], bbox[1]),
                    pt2=(bbox[2], bbox[3]),
                    color=(255, 0, 0),
                    thickness=2
                )

    # Convertir la imagen a un buffer
    is_success, buffer = cv2.imencode(".png", cv2.cvtColor(imagen, cv2.COLOR_BGR2RGB))
    if not is_success:
        raise Exception("No se pudo codificar la imagen")

    return buffer.tobytes()

def extraer_caras(
    imagen: Union[PIL.Image.Image, np.ndarray],
    bboxes: np.ndarray,
    output_img_size: Union[list, tuple, np.ndarray]=[160, 160]
    ) -> None:

    # Comprobaciones iniciales
    # --------------------------------------------------------------------------
    if not isinstance(imagen, (np.ndarray, PIL.Image.Image)):
        raise Exception(
        f"`imagen` debe ser np.ndarray, PIL.Image. Recibido {type(imagen)}."
        )

    # Recorte de cara
    # --------------------------------------------------------------------------
    if isinstance(imagen, PIL.Image.Image):
        imagen = np.array(imagen)
    
    caras = []
    
    if len(bboxes) > 0:
        
        for bbox in bboxes:
            x1, y1, x2, y2 = bbox
            cara = imagen[y1:y2, x1:x2]
            # Redimensionamiento del recorte
            cara = Image.fromarray(cara)
            cara = cara.resize(tuple(output_img_size))
            cara = np.array(cara)
            caras.append(cara)
        caras = np.stack(caras, axis=0) 
    return caras

def calcular_embeddings(
    img_caras: np.ndarray,
    encoder=None,
    device: str=None
    ) -> np.ndarray:

    # Comprobaciones iniciales
    # --------------------------------------------------------------------------
    if not isinstance(img_caras, np.ndarray):
        raise Exception(
        f"`img_caras` debe ser np.ndarray {type(img_caras)}."
        )

    if img_caras.ndim != 4:
        raise Exception(
        f"`img_caras` debe ser np.ndarray con dimensiones [nº caras, ancho, alto, 3]."
        f" Recibido {img_caras.ndim}."
        )

    if encoder is None:
        print('Iniciando encoder InceptionResnetV1')
        encoder = InceptionResnetV1(
        pretrained = 'vggface2',
        classify   = False,
        device     = device
        ).eval()

    # Calculo de embedings
    # --------------------------------------------------------------------------
    # El InceptionResnetV1 modelo requiere que las dimensiones de entrada sean
    # [nº caras, 3, ancho, alto]
    caras = np.moveaxis(img_caras, -1, 1)
    caras = caras.astype(np.float32) / 255
    caras = torch.tensor(caras)
    embeddings = encoder.forward(caras).detach().cpu().numpy()
    embeddings = embeddings
    return embeddings

def identificar_caras(
  embeddings: np.ndarray,
  dic_referencia: dict,
  threshold_similaridad: float = 0.6
  ) -> list:

    try:
        identidades = []
        for i in range(embeddings.shape[0]):
            # Se calcula la similitud con cada uno de los perfiles de referencia.
            similitudes = {}
            for key, value in dic_referencia.items():
                 # Asegurarse de que value es un vector 1-D
                value = np.ravel(value)
                similitudes[key] = 1 - cosine(embeddings[i], value)
                
            # Se identifica la persona de mayor similitud.
            identidad = max(similitudes, key=similitudes.get)
            # Si la similitud < threshold_similaridad, se etiqueta como None
            if similitudes[identidad] < threshold_similaridad:
                identidad = None
            identidades.append(identidad)
        return identidades

    except Exception as e:
        print(e)

def crear_diccionario_referencia(folder_path:str,
    dic_referencia:dict=None,
    detector: facenet_pytorch.models.mtcnn.MTCNN=None,
    min_face_size: int=40,
    thresholds: list=[0.6, 0.7, 0.7],
    min_confidence: float=0.9,
    encoder=None,
    device: str=None,
    verbose: bool=False)-> dict:

    # Comprobaciones iniciales
    # --------------------------------------------------------------------------
    if not os.path.isdir(folder_path):
        raise Exception(
        f"Directorio {folder_path} no existe."
        )

    if len(os.listdir(folder_path) ) == 0:
        raise Exception(
            f"Directorio {folder_path} está vacío."
        )


    if detector is None:
        logging.info('Iniciando detector MTCC')
        detector = MTCNN(
        keep_all      = False,
        post_process  = False,
        min_face_size = min_face_size,
        thresholds    = thresholds,
        device        = device
        )

    if encoder is None:
        logging.info('Iniciando encoder InceptionResnetV1')
        encoder = InceptionResnetV1(
        pretrained = 'vggface2',
        classify   = False,
        device     = device
        ).eval()


    new_dic_referencia = {}
    folders = glob.glob(folder_path + "/*")

    for folder in folders:

        if platform.system() in ['Linux', 'Darwin']:
            identidad = folder.split("/")[-1]
        else:
            identidad = folder.split("\\")[-1]

        logging.info(f'Obteniendo embeddings de: {identidad}')
        embeddings = []
        # Se lista todas las imagenes .jpg .jpeg .tif .png
        path_imagenes = glob.glob(folder + "/*.jpg")
        path_imagenes.extend(glob.glob(folder + "/*.jpeg"))
        path_imagenes.extend(glob.glob(folder + "/*.tif"))
        path_imagenes.extend(glob.glob(folder + "/*.PNG"))
        logging.info(f'Total imagenes referencia: {len(path_imagenes)}')

        for path_imagen in path_imagenes:
            logging.info(f'Leyendo imagen: {path_imagen}')
            imagen = Image.open(path_imagen)
            # Si la imagen es RGBA se pasa a RGB
            if np.array(imagen).shape[2] == 4:
                imagen  = np.array(imagen)[:, :, :3]
                imagen  = Image.fromarray(imagen)

            bbox = detectar_caras(
                imagen,
                detector       = detector,
                min_confidence = min_confidence,
                verbose        = False
                )
            
            if len(bbox) > 1:
                logging.warning(
                f'Más de 2 caras detectadas en la imagen: {path_imagen}. '
                f'Se descarta la imagen del diccionario de referencia.'
                )
                continue

            if len(bbox) == 0:
                logging.warning(
                    f'No se han detectado caras en la imagen: {path_imagen}.'
                )
                continue

            cara = extraer_caras(imagen, bbox)
            embedding = calcular_embeddings(cara, encoder=encoder)
            embeddings.append(embedding)

            if verbose:
                print(f"Identidad: {identidad} --- Imágenes referencia: {len(embeddings)}")

            embedding_promedio = np.array(embeddings).mean(axis = 0)
            new_dic_referencia[identidad] = embedding_promedio

    if dic_referencia is not None:
        dic_referencia.update(new_dic_referencia)
        return dic_referencia
    else:
        return new_dic_referencia

def crear_diccionario_referencia_s3(bucket_name, folder_path_s3, **kwargs):
    s3 = get_s3_client()
    detector = kwargs.get('detector', None)
    encoder = kwargs.get('encoder', None)

    new_dic_referencia = {}

    # Listar objetos en S3
    s3_objects = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder_path_s3)
    
    #validar si no hay imagenes, devolver el error
    if 'Contents' not in s3_objects:
        raise Exception(
            f"No se encontraron usuarios para el entrenamiento, debe cargarlos del portal."
        )

    for obj in s3_objects.get('Contents', []):
        try:
            s3_key = obj['Key']
            if not s3_key.lower().endswith(('.jpg', '.jpeg', '.png', '.tif')):
                continue  # Ignorar archivos no válidos

            print(f"Procesando imagen S3: {s3_key}")
            image_file = download_file_from_s3(bucket_name, s3_key)
            if not image_file:
                continue

            imagen = Image.open(image_file)
            bbox = detectar_caras(imagen, detector=detector, min_confidence=0.9)

            if bbox is None or len(bbox) != 1:
                continue  # Ignorar imágenes sin caras válidas

            cara = extraer_caras(imagen, bbox)
            embedding = calcular_embeddings(cara, encoder=encoder)
            identidad = s3_key.split('/')[-2]  # Extraer nombre de la carpeta como identidad

            if identidad not in new_dic_referencia:
                new_dic_referencia[identidad] = []

            new_dic_referencia[identidad].append(embedding)
        except Exception as e:
            print(f"Error al procesar la imagen: {s3_key}")
            continue
        
    # Promediar los embeddings
    for identidad, embeddings in new_dic_referencia.items():
        new_dic_referencia[identidad] = np.mean(embeddings, axis=0)

    return new_dic_referencia
    
def pipeline_deteccion_imagen(imagen: Union[PIL.Image.Image, np.ndarray],
  dic_referencia:dict,
  detector: facenet_pytorch.models.mtcnn.MTCNN=None,
  keep_all: bool=True,
  min_face_size: int=20,
  thresholds: list=[0.6, 0.7, 0.7],
  device: str=None,
  min_confidence: float=0.5,
  fix_bbox: bool=True,
  output_img_size: Union[list, tuple, np.ndarray]=[160, 160],
  encoder=None,
  threshold_similaridad: float=0.5,
  ax=None,
  verbose=False):

    bboxes = detectar_caras(
        imagen         = imagen,
        detector       = detector,
        keep_all       = keep_all,
        min_face_size  = min_face_size,
        thresholds     = thresholds,
        device         = device,
        min_confidence = min_confidence,
        fix_bbox       = fix_bbox
    )

    if len(bboxes) == 0:
        logging.info('No se han detectado caras en la imagen.')
        boxes = mostrar_bboxes(
        imagen  = imagen,
        bboxes  = bboxes,
        ax      = ax
        )
        return boxes
    
    else:
        caras = extraer_caras(
        imagen = imagen,
        bboxes = bboxes
        )

        embeddings = calcular_embeddings(
        img_caras = caras,
        encoder   = encoder
        )

        identidades = identificar_caras(
        embeddings            = embeddings,
        dic_referencia        = dic_referencia,
        threshold_similaridad = threshold_similaridad
        )

        boxes = mostrar_bboxes(
        imagen      = imagen,
        bboxes      = bboxes,
        identidades = identidades,
        ax          = ax
        )

        return boxes, identidades

def runTest(imageEvalued= None):
    path = ('./assets/BaseDatos.zip')

    extract_dir = './assets/images'

    zip_path = path
    with zipfile.ZipFile(zip_path, "r") as f:
        f.extractall(extract_dir)

    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    print(F'Running on device: {device}')


    nombre_archivo = generar_nombre_archivo()

    diccionario_path = './assets/'+nombre_archivo  # Ruta donde guardar el diccionario
    #Si el diccionario con la fecha actual ya existe, lo cargamos
    if os.path.exists(diccionario_path):
        # Cargar el diccionario existente
        with open(diccionario_path, 'rb') as f:
            dic_referencia = pickle.load(f)

        print('Cargando diccionario de referencia existente...')
    # Si no existe, creamos uno nuevo
    else:
        # Crear y guardar el diccionario
        dic_referencia = crear_diccionario_referencia(
            folder_path    = './assets/images/BaseDatos',
            min_face_size  = 40,
            min_confidence = 0.95,
            device         = device,
            verbose        = True
        )
        print('Creando y guardando diccionario de referencia...')
        with open(diccionario_path, 'wb') as f:
            pickle.dump(dic_referencia, f)
    
    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    print(F'Running on device: {device}')

    # aca es donde tenemos que cambiar la imagen a leer.
    # se debe recoger esta imagen desde el frontend sacando la foto y guardandola en assets/images/imagen.jpg
    imagen = imageEvalued
    
    if imageEvalued is None:
        imagen = Image.open('./assets/images/grupoGrande.PNG')
        

    fig, ax = plt.subplots(figsize=(12, 7))
    boxes, identidades = pipeline_deteccion_imagen(
        imagen = imagen,
        dic_referencia        = dic_referencia,
        min_face_size         = 40,
        thresholds            = [0.6, 0.7, 0.7],
        min_confidence        = 0.95,
        threshold_similaridad = 0.6,
        device                = device,
        ax                    = ax,
        verbose               = False
    )

    identidades_presentes = [identidad for identidad in identidades if identidad is not None]

    guardar_presentes(identidades_presentes)

    print(f'Presentes: { identidades_presentes }')
    return boxes

def check_in_data_client(imageEvalued=None, client_id=None):
    bucket_name = os.environ['AWS_STORAGE_BUCKET_NAME']
    s3_folder_images = f'{client_id}/'
    s3_diccionario_path = f'{client_id}/diccionarios/'

    nombre_diccionario = generar_nombre_archivo()

    # Descargar o crear diccionario
    dic_referencia = None
    try:
        dic_file = download_file_from_s3(bucket_name, f'{s3_diccionario_path}{nombre_diccionario}')
        if dic_file:
            dic_referencia = pickle.load(dic_file)
            print("Diccionario cargado desde S3.")
    except Exception:
        pass
    
    # si el diccionario no existe, hay que crearlo entrenando las imagenes
    if dic_referencia is None or len(dic_referencia) == 0:
        print("Creando diccionario de referencia...")
        dic_referencia = training_data(client_id)

    if dic_referencia is None:
        raise Exception("No se pudo crear el diccionario de referencia.")
    
    if len(dic_referencia) == 0:
        raise Exception("No se encontraron usuarios ni imagenes. Debe cargarlos desde el portal.")
    
    # Evaluar imagen
    if imageEvalued is None:
        image_file = download_file_from_s3(bucket_name, 'assets/images/grupoGrande.PNG')
        imageEvalued = Image.open(image_file)

    fig, ax = plt.subplots(figsize=(12, 7))
    boxes, identidades = pipeline_deteccion_imagen(
        imagen=imageEvalued,
        dic_referencia=dic_referencia,
        min_confidence=0.95,
        device=torch.device('cuda:0' if torch.cuda.is_available() else 'cpu'),
        ax=ax
    )

    print(f"Identidades detectadas: {identidades}")
    identidades_presentes = [identidad for identidad in identidades if identidad is not None]
    
    # guardar_presentes(identidades_presentes) TODO: guardar en firebase o s3
    
    return boxes, identidades_presentes

def training_data(client_id):
    """
    Entrena un diccionario de referencias para un cliente.
    
    Crea un diccionario de referencias a partir de las imagenes de un cliente
    en S3 y lo sube a S3.
    
    Parameters
    ----------
    client_id : str
        Identificador del cliente.
    
    Returns
    -------
    dict
        Diccionario de referencias.
    """
    
    try:
        bucket_name = os.environ['AWS_STORAGE_BUCKET_NAME']
        s3_folder_images = f'{client_id}/'
        s3_diccionario_path = f'{client_id}/diccionarios/'
        nombre_diccionario = generar_nombre_archivo()
        dic_referencia = crear_diccionario_referencia_s3(bucket_name, s3_folder_images)
        # Subir diccionario a S3
        with io.BytesIO() as buffer:
            pickle.dump(dic_referencia, buffer)
            buffer.seek(0)
            upload_file_to_s3(bucket_name, f'{s3_diccionario_path}{nombre_diccionario}', buffer.getvalue())
        return dic_referencia
    except Exception as e:
        print(f"Error al subir diccionario a S3: {e}")
        return None
            

def generar_nombre_archivo(nombre= "diccionario"):
    fecha_actual = datetime.date.today()
    fecha_sin_horas = fecha_actual.strftime('%Y-%m-%d')  # Formato sin horas: YYYY-MM-DD
    nombre_archivo = f"{nombre}_{fecha_sin_horas}.pickle"  # Ejemplo: diccionario_2024-06-17.pickle
    return nombre_archivo


def guardar_presentes(presentes):
    #crear y guardar los presentes en un archivo .pickle
    #con el nombre presentes_fecha.pickle
    #si el presente ya esta en el archivo, no lo agrega
    nombre_archivo = generar_nombre_archivo("presentes")
    presentes_existentes = retornar_presentes()
    if presentes_existentes is None:
        presentes_existentes = []
    presentes_actualizados = list(set(presentes_existentes + presentes))
    with open(nombre_archivo, 'wb') as f:
        pickle.dump(presentes_actualizados, f)


def retornar_presentes():
    try:
        nombre_archivo = generar_nombre_archivo("presentes")
        with open(nombre_archivo, 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        return None