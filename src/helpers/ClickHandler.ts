class ClickHandler {


    private clickableObjects: any[] = []

    public constructor(objects: any[]) {
        this.clickableObjects = objects;
        window.addEventListener("click", this.clickAction);
    }

    public clickAction(event: MouseEvent) {
        Array.from(this.clickableObjects).forEach((instance, index) => {
            // Instead of defining the action here make it return true 
            if (
                event.clientX >= instance.xPos &&
                event.clientX < instance.xPos + instance.image.width &&
                event.clientY >= instance.yPos &&
                event.clientY <= instance.yPos + instance.image.height
            ) {

            }
        })
    }

}