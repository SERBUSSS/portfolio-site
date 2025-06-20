const cardPositions = {
    'project-1': {
        desktop: [
            { x: '-20', y: '-20', rotation: -30, scale: 0.7, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.8, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.8, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.8, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.82, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.81, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.78, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.8, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.82, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.79, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.8, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.8, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.82, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.8, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.78, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.8, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.8, opacity: 1 }
        ],
        mobile: [
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.65, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.7, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.7, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.65, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.65, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.67, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.55, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.5, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.5, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ]
    },
    'project-2': { 
        desktop: [
            // Different layout for project 2 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ], 
        mobile: [
            // Different layout for project 2 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ] 
    },
    'project-3': { 
        desktop: [
            // Tighter spiral layout for project 3
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ], 
        mobile: [
            // Tighter spiral layout for project 3
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ] 
    },
    'project-4': { 
        desktop: [
            // Different layout for project 4 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ], 
        mobile: [
            // Different layout for project 4 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ] 
    },
    'process': {
        desktop: [
            { x: 0, y: -15, scale: 0.9, opacity: 1, rotation: -2 },
            { x: 0, y: -5, scale: 0.95, opacity: 1, rotation: 1 },
            { x: 0, y: 5, scale: 0.92, opacity: 1, rotation: -1 },
            { x: 0, y: 15, scale: 0.88, opacity: 1, rotation: 2 }
        ],
        mobile: [
            { x: 0, y: -15, scale: 0.95, opacity: 1, rotation: -1 },
            { x: 0, y: -5, scale: 1.0, opacity: 1, rotation: 0 },
            { x: 0, y: 5, scale: 0.97, opacity: 1, rotation: 1 },
            { x: 0, y: 15, scale: 0.93, opacity: 1, rotation: -1 }
        ]
    }
};

export { cardPositions };
