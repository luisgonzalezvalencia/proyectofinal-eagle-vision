import { Component } from '@angular/core';
import { BulkUploadComponent } from '../../../components/bulk-upload/bulk-upload.component';
import { TokenGeneratorComponent } from '../../../components/token-generator/token-generator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [TokenGeneratorComponent, BulkUploadComponent],
  providers: [],
})
export class HomeComponent {
  constructor() {}
}
