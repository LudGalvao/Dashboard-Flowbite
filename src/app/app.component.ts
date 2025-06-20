import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'dashboard';
  isSidebarOpen = true;

  ngOnInit(): void {
    // Recupera o estado salvo do sidebar, se existir
    const savedSidebarState = localStorage.getItem('isSidebarOpen');
    if (savedSidebarState !== null) {
      this.isSidebarOpen = savedSidebarState === 'true';
    }
    initFlowbite();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    // Salva o estado atual do sidebar
    localStorage.setItem('isSidebarOpen', String(this.isSidebarOpen));
  }
}
