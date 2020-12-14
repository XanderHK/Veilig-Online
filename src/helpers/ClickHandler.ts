class ClickHandler {

    public static click(instance: any, method: any, measurements: number[]) {
        window.addEventListener("click", (event: MouseEvent) => {
            instance[method]();
        });
    }
}