from PIL import Image
import matplotlib.pyplot as plt
import torch
from facenet_pytorch import MTCNN
import numpy as np
from facenet_pytorch import InceptionResnetV1
from scipy.spatial.distance import euclidean

def readImages():
    # test
    imagen_luis = Image.open('./assets/images/Luis/luis0.PNG')
    imagen_santiago = Image.open('./assets/images/Santiago/santiago0.PNG')
    imagen_grupalChica = Image.open('./assets/images/grupoChico.PNG')

# Representación de imágenes
# ==============================================================================

    # plt.figure(figsize=(5, 4))
    # plt.imshow(imagen_luis)
    # plt.axis('off');

    # plt.figure(figsize=(5, 4))
    # plt.imshow(imagen_santiago)
    # plt.axis('off');

    # plt.figure(figsize=(12, 7))
    # plt.imshow(imagen_grupalChica)
    # plt.axis('off');

    # Detectar si se dispone de GPU cuda
    # ==============================================================================
    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    print('Running on device: {}'.format(device))

    # Detector MTCNN
    # ==============================================================================
    mtcnn = MTCNN(
                select_largest = True,
                min_face_size  = 20,
                thresholds     = [0.6, 0.7, 0.7],
                post_process   = False,
                image_size     = 160,
                device         = device
            )
    
    # Detección de bounding box y landmarks
    # ==============================================================================
    boxes, probs, landmarks = mtcnn.detect(imagen_luis, landmarks=True)
    print('Bounding boxes:', boxes)
    print('Probability:', probs)
    print('landmarks:', landmarks)

    # Representación con matplotlib
    # ==============================================================================
    # En punto de origen (0,0) de una imagen es la esquina superior izquierda
    box = boxes[0]
    landmark = landmarks[0]
    # fig, ax  = plt.subplots(figsize=(5, 4))
    # ax.imshow(imagen_luis)
    # ax.scatter(landmark[:, 0], landmark[:, 1], s=8, c= 'red')
    # rect = plt.Rectangle(
    #             xy     = (box[0], box[1]),
    #             width  = box[2] - box[0],
    #             height = box[3] - box[1],
    #             fill   = False,
    #             color  = 'red'
    #     )
    # ax.add_patch(rect)
    # ax.axis('off');

    # Detección de bounding box y landmarks
    # ==============================================================================
    boxes, probs, landmarks = mtcnn.detect(imagen_grupalChica, landmarks=True)

    # Representación con matplotlib
    # ==============================================================================
    # fig, ax = plt.subplots(figsize=(12, 7))
    # ax.imshow(imagen_grupalChica)

    # for box, landmark in zip(boxes, landmarks):
    #     ax.scatter(landmark[:, 0], landmark[:, 1], s=8, c= 'red')
    #     rect = plt.Rectangle(
    #                 xy     = (box[0], box[1]),
    #                 width  = box[2] - box[0],
    #                 height = box[3] - box[1],
    #                 fill   = False,
    #                 color  = 'red'
    #         )
    #     ax.add_patch(rect)

    # ax.axis('off');

    # Detección de cara
    # ==============================================================================
    face = mtcnn.forward(imagen_luis)
    # Detector MTCNN
    # ==============================================================================
    mtcnn = MTCNN(
                keep_all      = True,
                min_face_size = 20,
                thresholds    = [0.6, 0.7, 0.7],
                post_process  = False,
                image_size    = 160,
                device        = device
            )

    # Detección de caras
    # ==============================================================================
    faces = mtcnn.forward(imagen_grupalChica)
    faces.shape

    # Extracción de cara a partir de una bounding box
    # ==============================================================================
    boxes, probs, landmarks = mtcnn.detect(imagen_luis, landmarks=True)
    x1, y1, x2, y2 = boxes[0].astype(int)
    recorte_cara = np.array(imagen_luis)[y1:y2, x1:x2]

    # Modelo para hacer el embedding de las caras
    # ==============================================================================
    encoder = InceptionResnetV1(pretrained='vggface2', classify=False, device=device).eval()
    cara = mtcnn(imagen_luis)
    # Embedding de cara
    # ==============================================================================
    embedding_cara = encoder.forward(cara.reshape((1,3, 160, 160))).detach().cpu()
    embedding_cara

    # Detector MTCNN
    # ==============================================================================
    mtcnn = MTCNN(
                keep_all      = True,
                min_face_size = 20,
                thresholds    = [0.6, 0.7, 0.7],
                post_process  = False,
                image_size    = 160,
                device        = device
            )    
    

    # Extracción de las caras MTCNN
    # ==============================================================================
    luis_1 = mtcnn(imagen_luis)[0]
    luis_2 = mtcnn(imagen_grupalChica)[0]
    lucas = mtcnn(imagen_grupalChica)[1]
    santiago_1 = mtcnn(imagen_santiago)[0]
    santiago_2 = mtcnn(imagen_grupalChica)[2]

    # Embeddings
    # ==============================================================================
    embeding_luis_1 = encoder.forward(luis_1.reshape((1,3, 160, 160))).detach().cpu()
    embeding_luis_2 = encoder.forward(luis_2.reshape((1,3, 160, 160))).detach().cpu()
    embeding_lucas = encoder.forward(lucas.reshape((1,3, 160, 160))).detach().cpu()
    embeding_santiago_1 = encoder.forward(santiago_1.reshape((1,3, 160, 160))).detach().cpu()
    embeding_santiago_2 = encoder.forward(santiago_2.reshape((1,3, 160, 160))).detach().cpu()

    # Distancias entre embeddings de caras contra Luis 1
    # ==============================================================================
    print(f"Distancia entre Luis 1 y Luis 1: {euclidean(embeding_luis_1.reshape(-1), embeding_luis_1.reshape(-1))}")
    print(f"Distancia entre Luis 1 y Luis 2: {euclidean(embeding_luis_1.reshape(-1), embeding_luis_2.reshape(-1))}")
    print(f"Distancia entre Luis 1 y Lucas: {euclidean(embeding_luis_1.reshape(-1), embeding_lucas.reshape(-1))}")
    print(f"Distancia entre Luis 1 y Santiago 1: {euclidean(embeding_luis_1.reshape(-1), embeding_santiago_1.reshape(-1))}")
    print(f"Distancia entre Luis 1 y Santiago 2: {euclidean(embeding_luis_1.reshape(-1), embeding_santiago_2.reshape(-1))}")
   

   # Distancias entre embeddings de caras contra Santiago 1
    # ==============================================================================

    print(f"Distancia entre Santiago 1 y Santiago 1: {euclidean(embeding_santiago_1.reshape(-1), embeding_santiago_1.reshape(-1))}")
    print(f"Distancia entre Santiago 1 y Santiago 2: {euclidean(embeding_santiago_1.reshape(-1), embeding_santiago_2.reshape(-1))}")
    print(f"Distancia entre Santiago 1 y Lucas: {euclidean(embeding_santiago_1.reshape(-1), embeding_lucas.reshape(-1))}")
    print(f"Distancia entre Santiago 1 y Luis 1: {euclidean(embeding_santiago_1.reshape(-1), embeding_luis_1.reshape(-1))}")
    print(f"Distancia entre Santiago 1 y Luis 2: {euclidean(embeding_santiago_1.reshape(-1), embeding_luis_2.reshape(-1))}")