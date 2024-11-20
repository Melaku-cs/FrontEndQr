// jspdf-autotable.d.ts
import 'jspdf';

declare module 'jspdf' {
    export interface jsPDF {
        autoTable: any; // You can define a more specific type if needed
    }
}