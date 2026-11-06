import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Home · Kids Course Builder',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'spaces',
    title: 'Spaces · Kids Course Builder',
    loadComponent: () => import('./features/spaces/spaces').then((m) => m.Spaces),
  },
  {
    path: 'equipment',
    title: 'Equipment · Kids Course Builder',
    loadComponent: () => import('./features/equipment/equipment').then((m) => m.Equipment),
  },
  {
    path: 'courses',
    title: 'Courses · Kids Course Builder',
    loadComponent: () => import('./features/courses/courses').then((m) => m.Courses),
  },
  {
    path: '**',
    title: 'Page not found · Kids Course Builder',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
