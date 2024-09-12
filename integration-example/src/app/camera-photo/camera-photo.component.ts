import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CheckService } from '../services/check.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-camera-photo',
  standalone: true,
  templateUrl: './camera-photo.component.html',
  styleUrls: ['./camera-photo.component.scss'],
  imports: [
    HttpClientModule
  ],
  providers: [
    CheckService
  ]
})
export class CameraPhotoComponent implements OnInit {
  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('imageResult') imageResult!: ElementRef; // Nueva referencia para mostrar la imagen resultante
  @ViewChild('loading') loading!: ElementRef;

  private stream!: MediaStream;

  public captured: boolean = false;
  public imageUrl: string | null = null; // Variable para almacenar la URL de la imagen

  constructor(private checkService: CheckService) { }

  ngOnInit(): void {
    this.startCamera();
    
  }


  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.video.nativeElement.srcObject = stream;
        this.loading.nativeElement.style.display = 'none';
      })
      .catch(err => {
        console.error("Error accessing the camera", err);
      });
  }

  capture() {

    this.captured = true;
    const canvas = this.canvas.nativeElement;
    const video = this.video.nativeElement;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.pause();

    canvas.style.display = 'block';

    // Convertir la imagen a formato RGB y luego a Blob
    canvas.toBlob((blob: Blob) => {
      if (blob) {
        console.log(blob);
        const formData = new FormData();
        formData.append('file', blob, 'capture.png');
        this.postData(formData);
      }
    }, 'image/png');
  }


  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }


  postData(formData: FormData) {
    this.loading.nativeElement.style.display = 'block';
    this.checkService.postData(formData).subscribe({
      next: (response: Blob) => {
        console.log('Response:', response);

        // Crear una URL para el blob
        const url = URL.createObjectURL(response);
        this.imageUrl = url;
        // Mostrar la imagen en el elemento img
        if (this.imageResult.nativeElement) {
          this.imageResult.nativeElement.src = url;
          this.canvas.nativeElement.style.display = 'none';
        }
        this.loading.nativeElement.style.display = 'none';
      },
      error: (error: any) => {
        console.log('Error:', error);
        this.loading.nativeElement.style.display = 'none';
      }
    });
  }

}
