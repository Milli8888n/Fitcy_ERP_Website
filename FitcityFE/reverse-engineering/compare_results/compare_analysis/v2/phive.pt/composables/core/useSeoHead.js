import { BASE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_SOCIAL_IMAGE, SITE_THEME_COLOR } from '@/config/site'
import { useRouter, useHead, useSeoMeta, useRuntimeConfig } from '#imports'
import { removeTrailingSlash } from '~/utils/routing'

const useSeoHead = (meta) => {
	const router = useRouter()
	const path = router.currentRoute.value.path
	const url = `${removeTrailingSlash(BASE_URL)}${path}`

	function parseTitle() {
		let title

		if (router.currentRoute.value.path === '/' || router.currentRoute.value.path === '/en') {
			title = meta.title + ' — ' + meta.sitedescription
		} else {
			title = meta.title + ' | ' + meta.sitename + ' — ' + meta.sitedescription
		}

		return title
	}

	let link = [
		{
			rel: 'canonical',
			href: url,
		},
		{ rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
		{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
		{ rel: 'shortcut icon', type: 'image/svg+xml', href: '/favicon.ico' },
		{ rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon.png', size: '180x180' },
		{ rel: 'manifest', href: '/site.webmanifest' },
	]

	// https://developers.google.com/search/docs/specialty/international/localized-versions?hl=en&visit_id=638549870917371248-3960734594&rd=1
	if (Object.hasOwn(meta, 'alternates') && meta.alternates?.length) {
		const alternates = meta.alternates.map(({ lang, path }) => ({
			ref: 'alternate',
			hreflang: lang,
			href: `${removeTrailingSlash(BASE_URL)}${path}`,
		}))

		link = [...link, ...alternates]
	}

	const htmlAttrs = {
		lang: meta.lang || 'en',
	}

	const scripts = [...(meta.head?.scripts || [])]

	if (meta.tiktok?.pixelId) {
		scripts.push({
			innerHTML: `
				!function (w, d, t) {
					w.TiktokAnalyticsObject = t;
					var ttq = w[t] = w[t] || [];
					ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
					ttq.setAndDefer = function (t, e) {
						t[e] = function () {
							t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
						};
					};
					for (var i = 0; i < ttq.methods.length; i++) {
						ttq.setAndDefer(ttq, ttq.methods[i]);
					}
					ttq.load = function (e) {
						var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
						var n = document.createElement("script");
						n.type = "text/javascript";
						n.async = true;
						n.src = r + "?sdkid=" + e + "&lib=" + t;
						var s = document.getElementsByTagName("script")[0];
						s.parentNode.insertBefore(n, s);
					};
					ttq.load('${meta.tiktok.pixelId}');
					ttq.page();
				}(window, document, 'ttq');
			`,
			type: 'text/javascript',
		})
	}

	useHead(
		{
			script: scripts,
		},
		{ mode: 'client' },
	)

	useHead({
		viewport: 'width=device-width, initial-scale=1',
		charset: 'utf-8',
		title: parseTitle(),
		meta: [{ name: 'theme-color', content: SITE_THEME_COLOR }, { name: 'viewport', content: 'width=device-width, initial-scale=1.0, interactive-widget=resizes-content' }, ...meta.head?.tags],
		link: link,
		htmlAttrs: htmlAttrs,
	})

	useSeoMeta({
		charset: 'utf-8',
		formatDetection: 'telephone=no',

		description: meta.description || SITE_DESCRIPTION,
		keywords: meta.keywords ? meta.keywords : '',
		author: meta.sitename || SITE_NAME,
		// robots: meta.unlisted ? 'noindex, nofollow' : 'index, follow',

		ogTitle: parseTitle(),
		ogDescription: meta.description || SITE_DESCRIPTION,
		ogImage: meta.image ? meta.image.url : BASE_URL + SITE_SOCIAL_IMAGE,
		ogImageWidth: meta.image ? meta.image.width : '1400',
		ogImageHeight: meta.image ? meta.image.height : '700',
		ogType: 'website',
		ogSiteName: meta.sitename || SITE_NAME,
		ogUrl: url,

		twitterTitle: parseTitle(),
		twitterDescription: meta.description || SITE_DESCRIPTION,
		twitterImage: meta.image ? meta.image.url : BASE_URL + SITE_SOCIAL_IMAGE,
		twitterCard: 'summary_large_image',
	})
}
export { useSeoHead }
