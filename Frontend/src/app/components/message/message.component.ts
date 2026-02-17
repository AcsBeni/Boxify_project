import { Component } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [MessageModule,],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
type= "string|null|undefined";
text= "string|undefined";

}
