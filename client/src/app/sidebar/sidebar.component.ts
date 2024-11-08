import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
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
    MatButtonModule,
    CommonModule,
    RouterModule
  ],
})
export class SidebarComponent {
  isExpanded = false; // Fix for "isExpanded" error

  links = [
    // https://fonts.google.com/icons for more icons
    { label: 'Dashboard', icon: 'dashboard', route: '/' },
    { label: 'Calendar', icon: 'calendar_today', route: '/calendar' },
    { label: 'Activity List', icon: 'list', route: '/list' }
  ]; // Fix for "links" error
}
