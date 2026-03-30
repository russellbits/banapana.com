export const SECTIONS = {
	Fabertising: {
		cssName: 'fabertising',
		color: '#E042E0',
		svgFile: 'fabertising'
	},
	"It's Thinking": {
		cssName: 'its_thinking',
		color: '#5EC035',
		svgFile: 'it-s-thinking'
	},
	'Mind Control': {
		cssName: 'mind_control',
		color: '#3AB7F4',
		svgFile: 'mind-control'
	},
	'Made You Look': {
		cssName: 'made_you_look',
		color: '#7645AF',
		svgFile: 'made-you-look'
	},
	'Design Science': {
		cssName: 'design_science',
		color: '#EBAF00',
		svgFile: 'design-science'
	},
	'Social Butterfly': {
		cssName: 'social_butterfly',
		color: '#66CCA0',
		svgFile: 'social-butterfly'
	},
	'Generic Banapana': {
		cssName: 'banapana_green',
		color: '#5EC035',
		svgFile: 'banapana'
	}
};

export const DEFAULT_SECTION = {
	cssName: 'banapana_green',
	color: '#5EC035',
	svgFile: null
};

export function getSection(name) {
	return SECTIONS[name] ?? DEFAULT_SECTION;
}

export function slugRotation(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
	}
	return (Math.abs(hash) % 9) - 4; // integer -4 to +4
}
