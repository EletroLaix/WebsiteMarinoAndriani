/** Text effects that turn characters into zeros and ones before they settle. */

export function randomBit(): string {
	return Math.random() < 0.5 ? "0" : "1";
}

/**
 * Builds the frame shown at the given progress: characters resolve from left to right,
 * and the ones still waiting are shown as random binary digits.
 */
export function scrambledFrame(text: string, progress: number): string {
	const characters = [...text];
	return characters
		.map((character, index) => {
			if (character.trim() === "") {
				return character;
			}
			const resolvesAt = 0.25 + (0.75 * index) / characters.length;
			return progress >= resolvesAt ? character : randomBit();
		})
		.join("");
}
