<script lang="ts">
	import { supabase } from '$lib/supabaseClient.js';

	let email = $state('');
	let successMessage = $state('');
	let errorMessage = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;
		successMessage = '';
		errorMessage = '';

		try {
			const emailValue = email.trim().toLowerCase();

			const { data: existingUser, error: findUserError } = await supabase
				.from('users')
				.select('id')
				.eq('email', emailValue)
				.eq('site_id', 7)
				.maybeSingle();

			let userId;

			if (existingUser) {
				userId = existingUser.id;
			} else {
				const { data: newUser, error: createUserError } = await supabase
					.from('users')
					.insert([
						{
							email: emailValue,
							site_id: 7
						}
					])
					.select('id')
					.maybeSingle();

				if (createUserError) {
					throw new Error('Could not create subscriber');
				}
				userId = newUser.id;
			}

			const { error: messageError } = await supabase.from('messages').insert([
				{
					user_id: userId,
					site_id: 7,
					message_text: 'subscribe'
				}
			]);

			if (messageError) {
				throw new Error('Could not process subscription');
			}

			successMessage = 'Thanks for subscribing!';
			email = '';
		} catch (err) {
			errorMessage = (err as Error).message || 'Something went wrong. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<footer>
	<div class="footer-contents">
		<div>
			<a class="logo-link" href="banapana.com" aria-label="Banapana">
				<svg
					width="400px"
					height="400px"
					viewBox="0 0 400 400"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
				>
					<g id="Logomark" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="Logomark-Copy-4" transform="translate(6.000000, 28.000000)">
							<path
								d="M41.8358805,298.840517 L41.8358805,39.3594828 C41.8358805,17.6218407 59.4558517,0 81.1911876,0 L340.644693,0 C362.380029,0 380,17.6218407 380,39.3594828 L380,298.840517 C380,320.578159 362.380029,338.2 340.644693,338.2 C167.015953,338.2 54.9306699,338.2 4.38884497,338.2 C2.77735639,338.2 -4.62489192,334.797651 4.38884497,328.098641 C13.1757773,321.008774 25.6581225,311.256066 41.8358805,298.840517 Z"
								id="Border-Background"
								stroke="#000000"
								stroke-width="4"
								fill="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<path
								d="M342.346514,3.75 C351.694896,3.75 360.158267,7.53856545 366.284543,13.6638471 C372.410819,19.7891287 376.2,28.2511264 376.2,37.5979911 L376.2,299.552009 C376.2,308.898874 372.410819,317.360871 366.284543,323.486153 C360.158267,329.611435 351.694896,333.4 342.346514,333.4 L6.65,333.4 L46.4964804,302.432126 L46.4964804,37.5979911 C46.4964804,28.2511264 50.285661,19.7891287 56.411937,13.6638471 C62.5382131,7.53856545 71.0015847,3.75 80.3499668,3.75 L342.346514,3.75 Z"
								id="Front-Background"
								stroke="#FFFFFF"
								stroke-width="4"
								fill="#5EC035"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<path
								d="M310.770689,158.444732 C307.007935,165.688958 298.062519,168.572581 290.679001,164.84497 C287.555206,163.29766 285.141363,160.625033 283.792451,157.46008 L272.930161,161.75035 L268.315462,191.00858 C267.960486,193.329545 265.759629,194.876856 263.416782,194.525194 C261.073935,194.173533 259.512037,191.993232 259.867014,189.672267 L261.570903,178.770763 L254.187385,181.795051 C258.944075,188.406286 257.382177,197.619815 250.708612,202.332078 C247.158844,204.86404 242.615141,205.708028 238.355419,204.582711 L222.807435,225.963726 C229.551995,230.605656 231.255883,239.819186 226.570189,246.500753 C224.795305,249.032715 222.310468,250.931687 219.399658,251.986671 L225.576254,279.767923 L241.639401,273.071008 L241.639401,253.604313 C241.639401,251.283348 243.414285,249.736038 245.757132,249.736038 L255.820279,249.736038 L255.820279,232.278283 C247.939793,230.02765 243.39609,221.939437 245.667942,214.132554 C247.939793,206.32567 256.10426,201.824404 263.984745,204.075037 C268.386458,205.341018 272.007221,209.576303 273.71111,213.79624 L309.776754,213.79624 L309.776754,195.650511 C309.705759,193.329545 311.480643,191.360241 313.894485,191.289909 L326.815641,191.289909 L326.815641,180.036744 L323.336868,166.462613 L310.770689,158.444732 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(273.107649, 218.614002) rotate(-180.000000) translate(-273.107649, -218.614002) "
							></path>
							<path
								d="M181.770689,159.444732 C178.007935,166.688958 169.062519,169.572581 161.679001,165.84497 C158.555206,164.29766 156.141363,161.625033 154.792451,158.46008 L143.930161,162.75035 L139.315462,192.00858 C138.960486,194.329545 136.759629,195.876856 134.416782,195.525194 C132.073935,195.173533 130.512037,192.993232 130.867014,190.672267 L132.570903,179.770763 L125.187385,182.795051 C129.944075,189.406286 128.382177,198.619815 121.708612,203.332078 C118.158844,205.86404 113.615141,206.708028 109.355419,205.582711 L93.8074351,226.963726 C100.551995,231.605656 102.255883,240.819186 97.5701893,247.500753 C95.7953052,250.032715 93.3104676,251.931687 90.3996577,252.986671 L96.5762542,280.767923 L112.639401,274.071008 L112.639401,254.604313 C112.639401,252.283348 114.414285,250.736038 116.757132,250.736038 L126.820279,250.736038 L126.820279,233.278283 C118.939793,231.02765 114.39609,222.939437 116.667942,215.132554 C118.939793,207.32567 127.10426,202.824404 134.984745,205.075037 C139.386458,206.341018 143.007221,210.576303 144.71111,214.79624 L180.776754,214.79624 L180.776754,196.650511 C180.705759,194.329545 182.480643,192.360241 184.894485,192.289909 L197.815641,192.289909 L197.815641,181.036744 L194.336868,167.462613 L181.770689,159.444732 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(144.107649, 219.614002) scale(-1, 1) rotate(-180.000000) translate(-144.107649, -219.614002) "
							></path>
							<path
								d="M186.700305,137.896504 C186.700305,130.701287 192.36186,124.705272 198.811733,123.364986 L198.811733,97.7584775 C194.081826,96.3476506 190.426898,92.7500419 188.850262,88.1648543 L163.122435,88.1648543 C161.187473,88.1648543 159.467507,86.471862 158.96585,84.637787 L152.659307,59.9483156 L111.380119,59.9483156 L111.380119,102.273124 L137.251277,102.273124 C139.4729,94.4430342 147.714404,89.8578467 155.669248,92.0446284 C162.119121,93.8081621 166.634032,99.5925526 166.634032,106.223439 C166.705698,112.783784 162.262452,118.568175 155.812579,120.331709 L155.812579,127.668009 L174.588876,127.668009 C176.95383,127.668009 178.745461,129.219918 178.745461,131.547783 L178.745461,154.050472 C180.895419,154.685345 182.902046,155.814006 184.622012,157.295374 L191.645207,148.900954 C188.491936,146.0793 186.700305,142.058443 186.700305,137.896504 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(155.095926, 108.621845) rotate(-180.000000) translate(-155.095926, -108.621845) "
							></path>
							<path
								d="M144.9308,218.201257 L163.839087,218.201257 L163.839087,200.229492 C158.304954,198.386234 154.154355,193.854892 152.770822,188.248316 L133.862534,188.248316 L133.862534,206.988104 C139.242941,208.600955 143.393541,212.825088 144.9308,218.201257 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(148.850811, 203.224786) rotate(-180.000000) translate(-148.850811, -203.224786) "
							></path>
							<path
								d="M253.768748,199.229492 L253.768748,217.201257 L272.677035,217.201257 C274.214294,211.825088 278.364894,207.600955 283.745301,205.988104 L283.745301,187.248316 L264.837014,187.248316 C263.45348,192.854892 259.302881,197.386234 253.768748,199.229492 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(268.757024, 202.224786) rotate(-180.000000) translate(-268.757024, -202.224786) "
							></path>
							<path
								d="M256.641985,82.7083283 C256.140328,84.6129447 254.420362,86.2353957 252.4854,86.2353957 L228.757573,86.2353957 C227.252602,90.8205832 223.526009,94.4181919 218.796102,95.8290189 L218.796102,123.435528 C225.245975,124.775813 230.907531,130.771828 230.907531,137.967045 C230.907531,142.128985 229.044234,146.149842 225.890963,148.900954 L232.985823,157.295374 C234.705789,155.814006 234.712416,152.685345 236.862374,152.050472 L236.862374,129.547783 C236.862374,127.219918 238.58234,125.668009 241.018959,125.668009 L259.795257,125.668009 L259.795257,118.331709 C251.840413,116.074385 247.325502,107.891589 249.61879,100.132041 C251.912078,92.3019515 260.225248,87.8578467 268.108426,90.1151698 C273.053329,91.5259967 276.923253,95.4057708 278.356558,100.273124 L304.227716,100.273124 L304.227716,57.9483156 L262.948528,57.9483156 L256.641985,82.7083283 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(261.511909, 107.621845) rotate(-180.000000) translate(-261.511909, -107.621845) "
							></path>
							<path
								d="M163.341041,131.36008 L134.682901,118.411932 C133.156317,117.708228 132.184855,116.16008 132.115465,114.400821 L132.115465,95.8934136 L98.3918422,95.8934136 C96.7958683,100.537858 93.0487991,104.056377 88.3996577,105.463784 L88.3996577,111.374895 L97.5591601,111.374895 C99.4326947,111.374895 101.098059,113.063784 101.58379,114.893414 L107.690125,139.523043 L129.339858,139.523043 C131.490953,131.711932 139.470823,127.137858 147.173132,129.31934 C153.418247,131.078599 157.720438,136.848969 157.720438,143.463784 C157.789828,150.008228 153.487637,155.778599 147.242522,157.537858 L147.242522,180.76008 C148.630325,180.126747 149.948738,179.352673 151.197762,178.508228 C147.311912,171.400821 149.879348,162.463784 156.887755,158.523043 C158.83068,157.467488 160.981776,156.834154 163.202261,156.693414 L163.202261,131.36008 L163.341041,131.36008 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(125.870350, 138.326747) rotate(-180.000000) translate(-125.870350, -138.326747) "
							></path>
							<path
								d="M265.842637,177.508228 C267.09166,178.352673 268.340683,179.126747 269.728487,179.76008 L269.728487,156.537858 C262.026178,154.286006 257.654597,146.123043 259.875083,138.382302 C262.095568,130.571191 270.144828,126.137858 277.777747,128.38971 C282.565668,129.797117 286.312737,133.667488 287.700541,138.523043 L309.350274,138.523043 L315.456609,113.893414 C315.94234,111.993414 317.607704,110.374895 319.481239,110.374895 L328.710131,110.374895 L328.710131,104.463784 C324.06099,103.056377 320.383311,99.537858 318.717947,94.8934136 L284.994324,94.8934136 L284.994324,113.400821 C284.994324,113.893414 284.855544,114.386006 284.647373,114.878599 C284.300423,116.004525 283.46774,116.91934 282.426888,117.411932 L253.768748,130.28971 L253.768748,155.763784 C261.818007,156.256377 267.993733,163.223043 267.508001,171.386006 C267.438611,173.497117 266.8141,175.608228 265.842637,177.508228 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(291.239440, 137.326747) rotate(-180.000000) translate(-291.239440, -137.326747) "
							></path>
							<path
								d="M198.811733,233.675374 C193.410552,231.821145 188.684519,226.115823 188.684519,219.340753 C188.684519,212.565683 193.410552,206.86036 198.811733,205.006131 L198.811733,187.604898 L186.118958,187.604898 C183.755942,187.462265 181.933043,185.465402 181.933043,182.969324 L181.933043,164.78361 L173.831272,164.78361 L173.831272,239.665963 L198.811733,239.665963 L198.811733,233.675374 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(186.321502, 202.224786) rotate(-180.000000) translate(-186.321502, -202.224786) "
							></path>
							<path
								d="M235.674792,181.969324 C235.607277,184.465402 233.784379,186.462265 231.488877,186.604898 L218.796102,186.604898 L218.796102,204.006131 C224.197283,205.86036 228.923316,211.565683 228.923316,218.340753 C228.923316,225.115823 224.197283,230.821145 218.796102,232.675374 L218.796102,238.665963 L243.776563,238.665963 L243.776563,163.78361 L235.674792,163.78361 L235.674792,181.969324 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(231.286333, 201.224786) rotate(-180.000000) translate(-231.286333, -201.224786) "
							></path>
							<path
								d="M198.243705,77.8048766 L180.1884,77.8048766 C177.739037,77.6640722 175.849528,75.6928103 175.849528,73.2287328 L175.849528,62.0347811 C171.230729,60.6267369 167.661657,57.0362241 166.122057,52.4600803 L140.858626,52.4600803 L140.858626,85.2675111 L147.786825,97.6583005 C155.624787,94.6310053 164.372512,98.503127 167.38173,106.388175 C167.521693,106.740186 167.591675,107.021795 167.731639,107.373806 L188.236307,107.373806 C189.216053,101.952835 193.065052,97.4470938 198.313687,95.6870385 L198.313687,77.8048766 L198.243705,77.8048766 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(169.586157, 79.916943) rotate(-180.000000) translate(-169.586157, -79.916943) "
							></path>
							<path
								d="M241.190279,62.0347811 L241.190279,73.2287328 C241.120297,75.6928103 239.230789,77.6640722 236.851407,77.8048766 L218.796102,77.8048766 L218.796102,95.6870385 C223.974756,97.4470938 227.823755,101.952835 228.873482,107.373806 L249.37815,107.373806 C251.127695,101.037607 256.866203,96.6022673 263.444493,96.6726695 C265.473965,96.6726695 267.433456,97.0246806 269.322964,97.7991049 L276.251163,85.3379133 L276.251163,52.4600803 L250.987732,52.4600803 C249.37815,57.0362241 245.809078,60.6267369 241.190279,62.0347811 Z"
								id="Path"
								fill="#FFFFFF"
								fill-rule="nonzero"
								transform="translate(247.523632, 79.916943) rotate(-180.000000) translate(-247.523632, -79.916943) "
							></path>
							<g
								id="Nodes"
								transform="translate(78.905519, 42.475767)"
								fill="#FFFFFF"
								fill-rule="nonzero"
								stroke="#FFFFFF"
								stroke-linejoin="round"
								stroke-width="2"
							>
								<ellipse
									id="Oval"
									transform="translate(89.178683, 244.863725) rotate(-180.000000) translate(-89.178683, -244.863725) "
									cx="89.1786834"
									cy="244.863725"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(34.245115, 206.240196) rotate(-180.000000) translate(-34.245115, -206.240196) "
									cx="34.2451153"
									cy="206.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(106.668914, 6.744118) rotate(-180.000000) translate(-106.668914, -6.744118) "
									cx="106.668914"
									cy="6.74411765"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(79.688453, 68.642157) rotate(-180.000000) translate(-79.688453, -68.642157) "
									cx="79.6884528"
									cy="68.6421569"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<path
									d="M2.50768726,57.4596503 C4.09314104,56.4985338 6.03806764,56.1412761 7.96231302,56.6228972 C8.48777153,56.8592558 8.80782679,56.968414 9.12866569,57.0219494 C10.9538909,57.8261588 12.1412118,59.0560124 12.8259675,60.5270938 C13.5088398,61.9941288 13.6921743,63.7025491 13.2503965,65.3915171 C12.7666723,67.3160559 11.5428885,68.8796969 9.95819986,69.8403497 C8.37274608,70.8014662 6.42781949,71.1587239 4.5035741,70.6771028 C2.57604952,70.1946609 1.00975626,68.9678781 0.0482608832,67.3781063 C-0.911330349,65.7914828 -1.26811578,63.8451236 -0.787252323,61.9194317 C-0.305423693,59.9898746 0.919994561,58.4221242 2.50768726,57.4596503 Z"
									id="Path"
									transform="translate(6.245115, 63.650000) rotate(-180.000000) translate(-6.245115, -63.650000) "
								></path>
								<path
									d="M28.7162219,28.9529412 C29.2843866,28.9529412 29.9329056,29.0346859 30.5025582,29.196184 C32.4183118,29.6818719 33.9555232,30.8839809 34.9070647,32.4452125 C35.8641163,34.0154845 36.2285587,35.9499241 35.7863615,37.8846715 C35.3028365,39.86481 34.0842488,41.4296657 32.5072019,42.3871282 C30.9151917,43.3536754 28.9567521,43.7013869 27.0185211,43.2155334 C26.4922352,42.9784317 26.1715514,42.8688899 25.8500789,42.8151679 C24.3269877,42.1214056 23.2994268,41.1881137 22.586428,40.0526758 C21.8805262,38.9285397 21.4824151,37.6059613 21.4824151,36.203417 C21.4824151,34.1897057 22.287488,32.3783948 23.5925584,31.0698346 C24.8985903,29.7603105 26.7065227,28.9529412 28.7162219,28.9529412 Z"
									id="Path"
									transform="translate(28.727530, 36.193137) rotate(-180.000000) translate(-28.727530, -36.193137) "
								></path>
								<ellipse
									id="Oval"
									transform="translate(6.245115, 158.240196) rotate(-180.000000) translate(-6.245115, -158.240196) "
									cx="6.2451153"
									cy="158.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(51.245115, 177.240196) rotate(-180.000000) translate(-51.245115, -177.240196) "
									cx="51.2451153"
									cy="177.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(28.727530, 90.106863) rotate(-180.000000) translate(-28.727530, -90.106863) "
									cx="28.7275304"
									cy="90.1068627"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(89.245115, 142.240196) rotate(-180.000000) translate(-89.245115, -142.240196) "
									cx="89.2451153"
									cy="142.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(179.610298, 68.642157) rotate(-180.000000) translate(-179.610298, -68.642157) "
									cx="179.610298"
									cy="68.6421569"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(226.245115, 205.240196) rotate(-180.000000) translate(-226.245115, -205.240196) "
									cx="226.245115"
									cy="205.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(169.618113, 244.863725) rotate(-180.000000) translate(-169.618113, -244.863725) "
									cx="169.618113"
									cy="244.863725"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(169.245115, 142.240196) rotate(-180.000000) translate(-169.245115, -142.240196) "
									cx="169.245115"
									cy="142.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(208.245115, 177.240196) rotate(-180.000000) translate(-208.245115, -177.240196) "
									cx="208.245115"
									cy="177.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<path
									d="M228.530991,28.9529412 C229.927421,28.9529412 231.264149,29.3535466 232.401722,30.065088 C233.543731,30.7794037 234.484705,31.8068761 235.083695,33.0518513 C235.963006,34.8606768 236.022782,36.8502038 235.414207,38.5988858 C234.803212,40.3545188 233.518868,41.8673099 231.713576,42.7145734 C231.066641,42.8514874 230.808597,42.9620429 230.496987,43.1187349 C229.753433,43.3503567 229.101553,43.4333333 228.530991,43.4333333 C226.52898,43.4333333 224.727833,42.6268581 223.426753,41.3183738 C222.127712,40.011941 221.326105,38.2036431 221.326105,36.1931373 C221.326105,34.1826314 222.127712,32.3743335 223.426753,31.0679007 C224.727833,29.7594164 226.52898,28.9529412 228.530991,28.9529412 Z"
									id="Path"
									transform="translate(228.571220, 36.193137) rotate(-180.000000) translate(-228.571220, -36.193137) "
								></path>
								<ellipse
									id="Oval"
									transform="translate(230.069266, 90.106863) rotate(-180.000000) translate(-230.069266, -90.106863) "
									cx="230.069266"
									cy="90.1068627"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<path
									d="M253.551681,56.4098039 C254.964306,56.4098039 256.316013,56.8138523 257.455379,57.5295925 C258.601283,58.2494398 259.53213,59.2839301 260.100234,60.5388383 C260.944575,62.351708 260.998096,64.3248577 260.387922,66.0642306 C259.78011,67.7968703 258.513678,69.3002044 256.704415,70.1827124 C254.867276,71.038266 252.863412,71.0923871 251.106612,70.4789117 C249.358099,69.86833 247.853712,68.5983928 247.008406,66.7911598 C246.159013,64.9751898 246.103997,62.9974498 246.71544,61.2544598 C247.323253,59.5218201 248.589684,58.018486 250.398947,57.135978 C251.065766,56.9920948 251.327605,56.880983 251.643721,56.7232864 C252.394544,56.4915047 252.973182,56.4098039 253.551681,56.4098039 Z"
									id="Path"
									transform="translate(253.551681, 63.650000) rotate(-180.000000) translate(-253.551681, -63.650000) "
								></path>
								<ellipse
									id="Oval"
									transform="translate(253.245115, 158.240196) rotate(-180.000000) translate(-253.245115, -158.240196) "
									cx="253.245115"
									cy="158.240196"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(152.131790, 6.744118) rotate(-180.000000) translate(-152.131790, -6.744118) "
									cx="152.13179"
									cy="6.74411765"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(202.092713, 6.240196) rotate(-180.000000) translate(-202.092713, -6.240196) "
									cx="202.092713"
									cy="6.24019608"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
								<ellipse
									id="Oval"
									transform="translate(57.206038, 6.240196) rotate(-180.000000) translate(-57.206038, -6.240196) "
									cx="57.2060377"
									cy="6.24019608"
									rx="7.2451153"
									ry="7.24019608"
								></ellipse>
							</g>
						</g>
					</g>
				</svg>
			</a>
		</div>
		<div class="book-section">
			<img
				alt="A book cover, 'Brother Dustfish,' with an abstract brain illustration."
				width="475"
				height="279"
				src="https://brotherdustfish.com/images/3D-book-cover-design.png"
			/>

			<h2>Brother Dustfish</h2>
			<p class="book-description">
				This is my current work of fiction. This is an unusual book for me, since it's kind of
				sci-fi/fantasy. But when I set out to write a new book, I decided I wasnted to write a book
				that was <i>fun</i> to write. Wouldn't you know, there were multiple passages that brought me
				to tears! 😅
			</p>
			<p class="book-description">
				The first five chapters are on <a href="https://brotherdustfish.com">the web site</a>
				for the book or just
				<a href="https://brotherdustfish.com/docs/brother-dustfish.250922.pdf"
					>download the ebook sample</a
				> for free!
			</p>
		</div>

		<!--<p class="privacy-notice">
					By signing up, you consent to Banapana processing your data. Unsubscribe anytime. See our <a
						href="https://banapana.com/privacy"
						class="privacy-link">Privacy policy</a
					>
					</p>-->
		<div>
			<form class="newsletter-form" onsubmit={handleSubmit}>
				<div class="email-field">
					<label class="field-label" for="newsletter-email">Get Banapana in your inbox!</label>
					<input
						id="newsletter-email"
						class="email-input"
						autocomplete="email"
						required
						placeholder="Your email"
						type="email"
						bind:value={email}
					/>
				</div>
				<button class="submit-button" type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Signing up...' : 'Sign up'}
				</button>
			</form>

			{#if successMessage}
				<p class="message success">{successMessage}</p>
			{/if}
			{#if errorMessage}
				<p class="message error">{errorMessage}</p>
			{/if}

			<h2>Me & My Pal's Sites</h2>

			<ul>
				<li>
					<a
						href="https://nicollebradfordplays.com"
						target="_blank"
						rel="noreferrer"
						class="footer-link">Nicolle Bradford Plays</a
					><br />
					<small>A nice site for a nice lady.</small>
				</li>
				<li>
					<a href="https://troped.org" target="_blank" rel="noreferrer" class="footer-link"
						>Troped</a
					>
				</li>
				<li>
					<a href="https://russellbits.com" target="_blank" rel="noreferrer" class="footer-link"
						>Russellbits</a
					>
				</li>
				<li>
					<a href="https://johnthecat.garden" target="_blank" rel="noreferrer" class="footer-link"
						>John the Cat's Pet Care Sitting</a
					>
				</li>
				<li>
					<a href="https://neal.fun" target="_blank" rel="noreferrer" class="footer-link"
						>Neal.fun</a
					>
				</li>
				<li>
					<a
						href="https://bureauoforganization.com"
						target="_blank"
						rel="noreferrer"
						class="footer-link">Bureau of Organization</a
					>
				</li>
			</ul>
		</div>

		<!-- <div class="footer-bottom">
			<hr class="divider" />
			<div class="copyright">
				<span>© 2026</span>
				<span class="logo-text">Banapana</span>
				<span>. Most rights not reserved. Have fun. MADE WITH ❤️ & Svelte & other stuff</span>
			</div>
		</div>
	</div> -->
	</div>
</footer>

<style>
	footer {
		position: relative;
		width: 100%;
		padding: 2rem 0;
		background-color: #1a1a18;
		color: #ffffff;
	}

	.footer-contents {
		width: 100%;
		max-width: 1000px;
		display: grid;
		grid-template-columns: 50px 1fr 500px;
		margin: 0 auto;
	}

	/* 2x2 square */
	@media (max-width: 900px) {
		.footer-contents {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* single column */
	@media (max-width: 480px) {
		.footer-contents {
			grid-template-columns: 1fr;
		}
	}

	.footer-contents div {
		padding: 0 1rem;
	}

	.logo-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		color: #e2e2dc;
		text-decoration: none;
		font-size: 2rem;
	}

	.logo-link:focus-visible {
		outline: 2px solid #7aaff0;
		outline-offset: 4px;
	}

	footer h2 {
		color: white;
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		line-height: 1.2;
	}

	@media (min-width: 1024px) {
		footer h2 {
			margin-bottom: 1.25rem;
		}
	}

	.book-section img {
		max-width: 200px;
		height: auto;
		object-fit: contain;
		padding: 1rem 0;
	}

	.book-description {
		color: white;
		font-size: 0.875rem;
		text-indent: none;
		margin: 0;
		line-height: 1.5;
	}

	@media (min-width: 1024px) {
		.book-description {
			margin-bottom: 1.25rem;
		}
	}

	@media (min-width: 1024px) {
		.email-field {
			margin: 0;
		}
	}

	.field-label {
		display: block;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
		color: #ffffff;
	}

	.email-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		background-color: #f0f0eb;
		color: #1a1a18;
		border: 1px solid #ddddd6;
		border-radius: 4px;
	}

	.email-input::placeholder {
		color: #6b6b63;
	}

	.email-input:focus {
		outline: 2px solid #7aaff0;
		outline-offset: 2px;
	}

	.submit-button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		background-color: #2a5caa;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.submit-button:hover:not(:disabled) {
		background-color: #1a3f80;
	}

	.submit-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 1023px) {
		.submit-button {
			width: 100%;
		}
	}

	@media (min-width: 1024px) {
		.submit-button {
			margin-top: 1.5rem;
			flex-shrink: 0;
		}
	}

	.message {
		font-size: 0.75rem;
		margin: 0.5rem 0;
	}

	.message.success {
		color: #4ade80;
	}

	.message.error {
		color: #f87171;
	}

	.privacy-notice {
		font-size: 0.625rem;
		line-height: 1.5;
		color: #8a8a82;
		margin: 0;
	}

	@media (min-width: 1024px) {
		.privacy-notice {
			margin-bottom: 1.25rem;
		}
	}

	.privacy-link {
		color: #7aaff0;
		text-decoration: underline;
	}

	.privacy-link:hover {
		color: #9dc4f5;
	}

	.links-section {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0;
	}

	/*@media (max-width: 1023px) {
		.links-section {
		}
	}*/

	@media (min-width: 1024px) {
		.links-section {
			grid-column: span 1;
			gap: 0.5rem 1rem;
		}
	}

	.links-column {
		width: 100%;
	}

	@media (max-width: 767px) {
		.links-column {
			grid-column: 1 / -1;
		}
	}

	footer ul {
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 1rem;
		line-height: 1.5;
	}

	@media (min-width: 768px) {
		footer ul {
			line-height: 1.75;
		}
	}

	footer ul li {
		margin-bottom: 0.25rem;
	}

	footer a {
		color: #5ec035;
		text-decoration: none;
	}

	footer a:hover {
		color: #7aaff0;
		font-size: calc(1rem + 0.125rem);
		font-weight: bold;
		text-decoration: underline;
	}

	.footer-bottom {
		padding-top: 1.5rem;
	}

	@media (min-width: 768px) {
		.footer-bottom {
			padding-top: 4rem;
		}
	}

	.divider {
		border: none;
		border-top: 1px solid #2e2e32;
		margin-bottom: 2rem;
	}

	.copyright {
		font-family: sans-serif;
		font-size: 0.825rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.375rem;
		color: #ffffff;
	}

	.logo-text {
		white-space: nowrap;
	}
</style>
