import { Essence } from '../index';
export interface ViewSupervisor {
    cancel: () => void;
    getConfirmationModal?: (newEssence: Essence) => JSX.Element;
    save?: (newEssence: Essence) => void;
    title?: string;
    saveLabel?: string;
}
