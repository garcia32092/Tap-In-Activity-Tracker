import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    RouterModule
  ],
})
export class SidebarComponent {
  isExpanded = true; // Fix for "isExpanded" error

  links = [
    { label: 'Home', icon: 'home', route: '/' },
    { label: 'Dashboard', icon: 'dashboard', route: '/log' },
    { label: 'Settings', icon: 'settings', route: '/list' }
  ]; // Fix for "links" error
}
