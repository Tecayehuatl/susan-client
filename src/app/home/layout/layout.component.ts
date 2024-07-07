import { Component } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
    public menu = [
        {
            name: 'Acerca de nosotros',
            url: '#about-us',
            // path:
        },
        {
            name: 'Ubicación',
            url: '#locate-me',
            // path:
        },
        {
            name: 'Iniciar sesión',
            url: 'login',
        },
    ];

    public footerMenu = [
        {
            name: 'Acerca de nosotros',
            url: '',
        },
        {
            name: 'Preguntas frecuentes',
            url: '',
        },
        {
            name: 'Facturación',
            url: '',
        },
        {
            name: 'Aviso de privacidad',
            url: '',
        },
    ];

    currentYear = new Date().getFullYear();
}
