class SlideCarousel {
    constructor(carouselId, itemsClassNames, leftArrowId, rightArrowId, autoPlay = false, autoPlayInterval = 3000, loop = false) {
        if (!carouselId) {
            throw new Error('Carousel id is required');
        }

        if (!itemsClassNames) {
            throw new Error('Items class names are required');
        }

        if (!leftArrowId) {
            throw new Error('Left arrow id is required');
        }

        if (!rightArrowId) {
            throw new Error('Right arrow id is required');
        }

        this.carousel = document.getElementById(carouselId);
        this.items = this.carousel.querySelectorAll("." + itemsClassNames);

        if (this.items.length === 0) {
            throw new Error('Items not found');
        }

        this.leftArrow = document.getElementById(leftArrowId);
        this.rightArrow = document.getElementById(rightArrowId);

        this.autoPlay = autoPlay;
        this.autoPlayInterval = autoPlayInterval;

        this.loop = loop;

        this.timeout = null;

        this.init();
    }

    init() {
        this.leftArrow.addEventListener("click", () => {
            this.left();
        });

        this.rightArrow.addEventListener("click", () => {
            this.right();
        });

        if (!this.loop) {
            this.carousel.addEventListener("scroll", () => {
                this.scrollEv();
            });
            setTimeout(() => {
                this.scrollEv();
            }, 100);
        }

        if (this.autoPlay) {
            this.timeout = setTimeout(() => {
                this.right();
            }, this.autoPlayInterval);
        }
    }

    listRectCarousel() {
        const rectList = [];
        const rectLeft = this.carousel.getBoundingClientRect().left;

        for (let i = 0; i < this.items.length; i++) {
            const rect = this.items[i].getBoundingClientRect();
            rectList.push(rect.left - rectLeft);
        }

        for (let i = rectList.length - 1; i >= 0; i--) {
            rectList[i] = rectList[i] - rectList[0];
        }

        return rectList;
    }

    scrollEv() {
        if (this.carousel.scrollLeft <= 0) {
            this.leftArrow.classList.add("arrow-inactive");
        } else {
            this.leftArrow.classList.remove("arrow-inactive");
        }

        if (this.carousel.scrollLeft >= this.carousel.scrollWidth - this.carousel.offsetWidth - 1) {
            this.rightArrow.classList.add("arrow-inactive");
        } else {
            this.rightArrow.classList.remove("arrow-inactive");
        }
    }

    left() {
        const rectList = this.listRectCarousel();
        let shiftScroll;

        clearTimeout(this.timeout);

        for (let i = 0; i < rectList.length; i++) {
            if (this.carousel.scrollLeft > rectList[rectList.length - 1]) {
                shiftScroll = rectList[rectList.length - 1];
            } else if (this.carousel.scrollLeft > rectList[i] && this.carousel.scrollLeft <= rectList[i + 1]) {
                shiftScroll = rectList[i];
            }
        }

        if (this.loop && this.carousel.scrollLeft <= 0) {
            shiftScroll = this.carousel.scrollWidth - this.carousel.offsetWidth;
        }

        this.carousel.scrollTo({
            left: shiftScroll,
            behavior: "smooth"
        });

        if (this.autoPlay) {
            this.timeout = setTimeout(() => {
                this.right();
            }, this.autoPlayInterval);
        }
    }

    right() {
        const rectList = this.listRectCarousel();
        let shiftScroll;

        clearTimeout(this.timeout);

        for (let i = 0; i < rectList.length; i++) {
            if (this.carousel.scrollLeft >= rectList[i] - 1 && this.carousel.scrollLeft < rectList[i + 1]) {
                shiftScroll = rectList[i + 1];
            }
        }

        if (this.loop && this.carousel.scrollLeft >= this.carousel.scrollWidth - this.carousel.offsetWidth - 1) {
            shiftScroll = 0;
        }

        this.carousel.scrollTo({
            left: shiftScroll,
            behavior: "smooth"
        });

        if (this.autoPlay) {
            this.timeout = setTimeout(() => {
                this.right();
            }, this.autoPlayInterval);
        }
    }
}