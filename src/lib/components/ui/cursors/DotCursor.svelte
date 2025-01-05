<script lang="ts">
	import clsx from 'clsx';
	import type { PointerEventHandler } from 'svelte/elements';
	import { Spring } from 'svelte/motion';

	type Coords = {
		x: number;
		y: number;
	};

	let showCustomCursor = $state(false);
	let canClick = $state(false);
	const coords: Coords = $state({
		x: 0,
		y: 0
	});
	const springX = Spring.of(() => coords.x);
	const springY = Spring.of(() => coords.y);
	let styleRef: HTMLStyleElement | null = $state(null);

	const hideDefaultCursor = () => {
		if (styleRef) {
			return;
		}

		const style = document.createElement('style');
		style.innerHTML = `
			* {
				cursor: none !important;
			}
		`;
		document.head.appendChild(style);
		styleRef = style;

		showCustomCursor = true;
	};

	const showDefaultCursor = () => {
		if (styleRef) {
			styleRef.remove();
			styleRef = null;
			showCustomCursor = false;
		}
	};

	const getElementAtCoords = (x: number, y: number) => {
		const element = document.elementFromPoint(x, y);
		if (element) {
			return element;
		}
		return null;
	};

	const getElementTree = (element: Element) => {
		const tree = [];

		let newElement: Element | null = element;
		while (newElement) {
			tree.push(newElement);
			newElement = newElement.parentElement;
		}

		return tree;
	};

	const memoisedElements = new Map<Element, Element | false>();
	const isMemoizedElementClickable = (element: Element) => {
		if (memoisedElements.has(element)) {
			return memoisedElements.get(element);
		}

		if (element instanceof HTMLButtonElement && !element.disabled) {
			memoisedElements.set(element, element);
			return element;
		}
		if (element instanceof HTMLAnchorElement && element.href) {
			memoisedElements.set(element, element);
			return element;
		}
		if (element instanceof HTMLInputElement && !element.disabled) {
			memoisedElements.set(element, element);
			return element;
		}
		if (element instanceof HTMLTextAreaElement && !element.disabled) {
			memoisedElements.set(element, element);
			return element;
		}

		memoisedElements.set(element, false);
		return false;
	};

	const memoisedElementTrees = new Map<Element, Element | false>();
	const isMemoisedElementTreeClickable = (element: Element) => {
		const tree = getElementTree(element);

		if (memoisedElementTrees.has(element)) {
			return memoisedElementTrees.get(element);
		}

		for (const el of tree) {
			if (isMemoizedElementClickable(el)) {
				memoisedElementTrees.set(element, el);
				return el;
			}
		}

		memoisedElementTrees.set(element, false);
		return false;
	};

	const handleMouseMove: PointerEventHandler<Window> = (e) => {
		if (e.pointerType === 'mouse') {
			hideDefaultCursor();
		}

		coords.x = e.clientX;
		coords.y = e.clientY;

		const element = getElementAtCoords(e.clientX, e.clientY);
		if (element && isMemoisedElementTreeClickable(element)) {
			canClick = true;
		} else {
			canClick = false;
		}
	};
</script>

<svelte:window
	onpointermove={handleMouseMove}
	ontouchstart={showDefaultCursor}
	ontouchmove={showDefaultCursor}
	ontouchend={showDefaultCursor}
/>

<div
	class="pointer-events-none fixed z-[9999] h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
	style:display={showCustomCursor ? 'flex' : 'none'}
	style:left={springX.current + 'px'}
	style:top={springY.current + 'px'}
>
	<div
		data-expand={canClick}
		class={clsx(
			'border-primary size-full max-h-8 max-w-8 rounded-full border-2 transition-[max-height_max-width]',
			'data-[expand=true]:max-h-14 data-[expand=true]:max-w-14'
		)}
	></div>
</div>
<div
	class="pointer-events-none fixed z-[9999]"
	style:display={showCustomCursor ? 'block' : 'none'}
	style:left={coords.x + 'px'}
	style:top={coords.y + 'px'}
>
	<div class="bg-primary size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
</div>

<style>
	:global(body, button, a, input, inputarea) {
		cursor: none;
	}
</style>
