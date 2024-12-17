import { Component } from '@angular/core';
import { BulkUploadComponent } from '../../../components/bulk-upload/bulk-upload.component';
import { SingleUploadComponent } from '../../../components/single-upload/single-upload.component';
import { TokenGeneratorComponent } from '../../../components/token-generator/token-generator.component';
import { TrainingComponent } from '../../../components/training/training.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    TokenGeneratorComponent,
    BulkUploadComponent,
    SingleUploadComponent,
    TrainingComponent,
  ],
  providers: [],
})
export class HomeComponent {
  constructor() {}
}
