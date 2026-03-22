export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const lang = query.lang || 'vi'

    const labels = {
        vi: {
            cta: "Tham gia ngay",
            clubs: "Câu lạc bộ",
            classes: "Lớp học"
        },
        en: {
            cta: "Join Now",
            clubs: "Clubs",
            classes: "Classes"
        }
    }

    const currentLabels = lang === 'en' ? labels.en : labels.vi



    return {
        menuCta: {
            label: currentLabels.cta,
            link: { type: "internal", path: "/" }
        },
        items: [
            { type: "link", title: currentLabels.clubs, link: { type: "internal", path: "/clubs" } },
            { type: "link", title: currentLabels.classes, link: { type: "internal", path: "/classes" } }
        ],
        clubs: []
    }
})

