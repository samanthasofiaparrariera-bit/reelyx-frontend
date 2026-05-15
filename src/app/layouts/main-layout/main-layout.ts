import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TopBar} from './components/top-bar/top-bar';
import {Footer} from './components/footer/footer';
@Component({
  selector: 'app-main-layout',
  imports: [ RouterOutlet, TopBar, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
