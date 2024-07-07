import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    public descriptions = [
        {
            title: 'Misión',
            description:
                'Brindar a nuestros usuarios servicios de análisis clínicos de calidad, confiables, eficientes y oportunos que ayuden a prevenir y controlar padecimientos con la ayuda de un equipo humano altamente calificado y con la ayuda de tecnología de vanguardia empleando estándares de calidad.',
        },
        {
            title: 'Visión',
            description:
                'Laboratorios Biotecsa busca ser un laboratorio clínico líder reconocido en su región para el 2024, aplicando esquemas de calidad en el servicio, eficiencia y capacitación continua, cumpliendo las leyes, reglas y regulaciones aplicables además de ofrecer tecnología de vanguardia para otorgar resultados confiables.',
        },
    ];
}
