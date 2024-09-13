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
            hash: true,
        },
        {
            name: 'Ubicación',
            url: '#locate-me',
            hash: true,
        },
        {
            name: 'Iniciar sesión',
            url: 'login',
            hash: false,
        },
    ];

    public footerMenu = [
        {
            name: 'Acerca de nosotros',
            url: '#about-us',
            hash: true,
        },
        {
            name: 'Preguntas frecuentes',
            url: 'faq',
            hash: false,
        },
        {
            name: 'Facturación',
            url: 'https://wa.me/525517298887?text=%C2%A1Hola%2C%20me%20gustar%C3%ADa%20una%20cotizaci%C3%B3n%21',
            hash: true,
        },
        {
            name: 'Aviso de privacidad',
            url: 'privacy-policy',
        },
    ];

    currentYear = new Date().getFullYear();
}
