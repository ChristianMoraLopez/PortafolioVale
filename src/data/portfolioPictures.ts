import { Picture } from '../types/Portfolio';

export const portfolioPictures: Picture[] = [

    {
        src: '/makeup/makeup1.png',
        width: 4,
        height: 3,
        description: 'Maquillaje de novia',
        date: '2021-08-14',
        location: 'Casa de la novia',
        camera: 'Canon EOS 5D Mark IV',
        model: 'EF 24-70mm f/2.8L II USM',
        tecnic: 'Natural'
    },
    {
        src: '/makeup/makeup2.png',
        width: 4,
        height: 3,
        description: 'Maquillaje de noche',
        date: '2021-08-14',
        location: 'Casa de la novia',
        camera: 'Canon EOS 5D Mark IV',
        model: 'EF 24-70mm f/2.8L II USM',
        tecnic: 'Natural'
    },
    {
        src: '/makeup/makeup3.jpg',
        width: 4,
        height: 3,
        description: 'Maquillaje de día',
        date: '2021-08-15', // Cambié la fecha para diferenciar
        location: 'Estudio de maquillaje',
        camera: 'Canon EOS 5D Mark IV',
        model: 'EF 24-70mm f/2.8L II USM',
        tecnic: 'Natural'
    },
    {
        src: '/makeup/makeup3.png', // Cambié el nombre del archivo
        width: 4,
        height: 3,
        description: 'Maquillaje de noche sofisticado',
        date: '2021-08-16', // Cambié la fecha
        location: 'Salón de belleza',
        camera: 'Canon EOS 5D Mark IV',
        model: 'EF 24-70mm f/2.8L II USM',
        tecnic: 'Glam'
    }
];
