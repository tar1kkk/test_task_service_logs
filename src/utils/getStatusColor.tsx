export const getStatusColor = (type: 'planned' | 'unplanned' | 'emergency'): string => {
    switch (type) {
        case 'planned':
            return 'green';   // Цвет для 'planned'
        case 'unplanned':
            return 'yellow';  // Цвет для 'unplanned'
        case 'emergency':
            return 'red';     // Цвет для 'emergency'
        default:
            return 'gray';    // Цвет по умолчанию, если тип неизвестен
    }
};
