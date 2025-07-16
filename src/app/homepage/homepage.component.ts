import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BodyComponent } from '../body/body.component';
import { FooterComponent } from '../footer/footer.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, FooterComponent, ModalComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {}
