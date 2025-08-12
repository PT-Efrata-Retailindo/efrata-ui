import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class ProgressService {
    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
    }

    /**
     * Update the progress bar
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} text - Optional progress text
     */
    updateProgress(progress, text = null) {
        this.eventAggregator.publish('loading:progress', {
            progress: progress,
            text: text
        });
    }

    /**
     * Update the loading text
     * @param {string} text - Loading text to display
     */
    updateLoadingText(text) {
        this.eventAggregator.publish('loading:text', text);
    }

    /**
     * Simulate a loading process with progress updates
     * @param {number} duration - Duration in milliseconds
     * @param {Array} steps - Array of step descriptions
     */
    simulateLoading(duration = 3000, steps = []) {
        const defaultSteps = [
            'Initializing...',
            'Loading configuration...',
            'Connecting to services...',
            'Loading user data...',
            'Finalizing...'
        ];
        
        const stepsToUse = steps.length > 0 ? steps : defaultSteps;
        const stepDuration = duration / stepsToUse.length;
        
        let currentStep = 0;
        
        const updateStep = () => {
            if (currentStep < stepsToUse.length) {
                const progress = ((currentStep + 1) / stepsToUse.length) * 100;
                this.updateProgress(progress, stepsToUse[currentStep]);
                currentStep++;
                
                setTimeout(updateStep, stepDuration);
            }
        };
        
        updateStep();
    }
}
