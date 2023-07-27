import {Overlay} from './teaset';

export class BaseOverlay{
    protected overlayKey:number | undefined|any;
    protected instance?:any;
    hide(){
        Overlay.hide(this.overlayKey);
        this.overlayKey=null;
    }
    show(options?:any){
        
    }
}