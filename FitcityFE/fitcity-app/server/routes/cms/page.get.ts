
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { path } = query
    const lang = query.lang || 'vi'

    const content = {
        vi: {
            highlights: [
                {
                    title: "FITCITY PORTO",
                    subtitle: "Boavista",
                    mainCta: { label: "KHÁM PHÁ CHI NHÁNH", href: "/clubs/porto" },
                    background: { type: "image", url: "/imgs/hero-1.jpg", width: 3840, height: 2160 },
                    contentBackground: {
                        type: "video",
                        url: "https://burospaces1.fra1.cdn.digitaloceanspaces.com/phive/2025-03-13T14-45-28.172Z-porto-edit2-web.mp4",
                        width: 1920,
                        height: 1080
                    },
                    richText: [
                        { _key: "b1", _type: "block", children: [{ _key: "s1", _type: "span", marks: [], text: "PHIVE PORTO" }], style: "h3" },
                        { _key: "b2", _type: "block", children: [{ _key: "s2", _type: "span", marks: [], text: "Tìm hiểu thêm" }], style: "h2" },
                        {
                            _key: "b3", _type: "block",
                            children: [{ _key: "c1", _type: "cta", label: "Khám phá Club", link: { type: "internal", path: "/clubs/porto" } }],
                            style: "normal"
                        }
                    ],
                    club: { path: "/vi/clubs/porto" }
                },
                {
                    title: "FITCITY LISBOA",
                    subtitle: "Avenida 5 de Outubro",
                    mainCta: { label: "XEM CHI TIẾT", href: "/clubs/lisbon" },
                    background: { type: "image", url: "/imgs/hero-2.jpg", width: 3840, height: 2160 },
                    contentBackground: {
                        type: "video",
                        url: "https://burospaces1.fra1.cdn.digitaloceanspaces.com/phive/2025-03-13T14-58-05.505Z-lisboa-web.mp4",
                        width: 1920,
                        height: 1080
                    },
                    richText: [
                        { _key: "b4", _type: "block", children: [{ _key: "s4", _type: "span", marks: [], text: "PHIVE LISBOA" }], style: "h3" },
                        { _key: "b5", _type: "block", children: [{ _key: "s5", _type: "span", marks: [], text: "Trải nghiệm cao cấp" }], style: "h2" },
                        {
                            _key: "b6", _type: "block",
                            children: [{ _key: "c2", _type: "cta", label: "Khám phá Club", link: { type: "internal", path: "/clubs/lisbon" } }],
                            style: "normal"
                        }
                    ],
                    club: { path: "/vi/clubs/lisbon" }
                },
                {
                    title: "TRAIN EVERY DAY",
                    subtitle: "Từ 06:30 đến 22:00",
                    mainCta: { label: "ĐĂNG KÝ NGAY", href: "/join" },
                    background: { type: "image", url: "/imgs/hero-3.jpg", width: 3400, height: 1913 },
                    contentBackground: {
                        type: "video",
                        url: "https://burospaces1.fra1.cdn.digitaloceanspaces.com/phive/2025-03-13T15-32-34.167Z-todos-dias-web.mp4",
                        width: 1920,
                        height: 1080
                    },
                    richText: [
                        { _key: "b7", _type: "block", children: [{ _key: "s7", _type: "span", marks: [], text: "TẬP LUYỆN MỖI NGÀY" }], style: "h3" },
                        { _key: "b8", _type: "block", children: [{ _key: "s8", _type: "span", marks: [], text: "Tại Fitcity Club" }], style: "h2" },
                        {
                            _key: "b9", _type: "block",
                            children: [{ _key: "c3", _type: "cta", label: "Gia nhập ngay", link: { type: "internal", path: "/join" } }],
                            style: "normal"
                        }
                    ],
                    club: null
                }
            ]
        },
        en: {
            highlights: [
                {
                    title: "FITCITY PORTO",
                    subtitle: "Boavista",
                    mainCta: { label: "EXPLORE BRANCH", href: "/en/clubs/porto" },
                    background: { type: "image", url: "/imgs/hero-1.jpg", width: 3840, height: 2160 },
                    contentBackground: {
                        type: "video",
                        url: "https://burospaces1.fra1.cdn.digitaloceanspaces.com/phive/2025-03-13T14-45-28.172Z-porto-edit2-web.mp4",
                        width: 1920,
                        height: 1080
                    },
                    richText: [
                        { _key: "b1e", _type: "block", children: [{ _key: "s1e", _type: "span", marks: [], text: "PHIVE PORTO" }], style: "h3" },
                        { _key: "b2e", _type: "block", children: [{ _key: "s2e", _type: "span", marks: [], text: "Learn more" }], style: "h2" },
                        {
                            _key: "b3e", _type: "block",
                            children: [{ _key: "c1e", _type: "cta", label: "Explore Club", link: { type: "internal", path: "/en/clubs/porto" } }],
                            style: "normal"
                        }
                    ],
                    club: { path: "/en/clubs/porto" }
                },
                {
                    title: "FITCITY LISBOA",
                    subtitle: "Avenida 5 de Outubro",
                    mainCta: { label: "VIEW DETAILS", href: "/en/clubs/lisbon" },
                    background: { type: "image", url: "/imgs/hero-2.jpg", width: 3840, height: 2160 },
                    contentBackground: {
                        type: "video",
                        url: "https://burospaces1.fra1.cdn.digitaloceanspaces.com/phive/2025-03-13T14-58-05.505Z-lisboa-web.mp4",
                        width: 1920,
                        height: 1080
                    },
                    richText: [
                        { _key: "b4e", _type: "block", children: [{ _key: "s4e", _type: "span", marks: [], text: "PHIVE LISBOA" }], style: "h3" },
                        { _key: "b5e", _type: "block", children: [{ _key: "s5e", _type: "span", marks: [], text: "Premium Experience" }], style: "h2" },
                        {
                            _key: "b6e", _type: "block",
                            children: [{ _key: "c2e", _type: "cta", label: "Explore Club", link: { type: "internal", path: "/en/clubs/lisbon" } }],
                            style: "normal"
                        }
                    ],
                    club: { path: "/en/clubs/lisbon" }
                },
                {
                    title: "TRAIN EVERY DAY",
                    subtitle: "From 06:30 AM to 10:00 PM",
                    mainCta: { label: "JOIN NOW", href: "/en/join" },
                    background: { type: "image", url: "/imgs/hero-3.jpg", width: 3400, height: 1913 },
                    contentBackground: {
                        type: "video",
                        url: "https://burospaces1.fra1.cdn.digitaloceanspaces.com/phive/2025-03-13T15-32-34.167Z-todos-dias-web.mp4",
                        width: 1920,
                        height: 1080
                    },
                    richText: [
                        { _key: "b7e", _type: "block", children: [{ _key: "s7e", _type: "span", marks: [], text: "TRAIN EVERY DAY" }], style: "h3" },
                        { _key: "b8e", _type: "block", children: [{ _key: "s8e", _type: "span", marks: [], text: "At Fitcity Club" }], style: "h2" },
                        {
                            _key: "b9e", _type: "block",
                            children: [{ _key: "c3e", _type: "cta", label: "Join Us Now", link: { type: "internal", path: "/en/join" } }],
                            style: "normal"
                        }
                    ],
                    club: null
                }
            ]
        }
    }

    const currentContent = lang === 'en' ? content.en : content.vi

    return {
        slug: "page",
        name: "Home",
        type: "page.home",
        metadata: {
            sitename: "FitCity",
            sitedescription: "Premium Fitness Experience",
            title: "FitCity",
            description: "Premium Fitness Experience"
        },
        blocks: [
            {
                name: "HomeHeader",
                props: {
                    highlights: currentContent.highlights
                }
            },
            {
                name: "PhiveClubs",
                props: {
                    tagline: { file: "/rive/phive.riv" },
                    title: lang === 'en' ? "PHIVE HAS CLUBS LOCATED IN COIMBRA,\nLEIRIA, LISBON, AND PORTO. GET TO KNOW\nEACH ONE!" : "FITCITY HIỆN CÓ MẶT TẠI NHIỀU KHU VỰC.\nHÃY TÌM HIỂU VÀ CHỌN CÂU LẠC BỘ\nPHÙ HỢP NHẤT VỚI BẠN!",
                    ctaTitle: "Fitcity",
                    ctaSubtitle: lang === 'en' ? "Choose your club" : "Chọn câu lạc bộ của bạn",
                    ctaList: [
                        {
                            label: lang === 'en' ? "View Clubs" : "Xem tất cả CLB",
                            link: { type: 'internal', path: "/clubs" }
                        }
                    ],
                    photoGrid: [
                        { url: "/imgs/hero-1.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-2.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-3.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-4.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-5.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-1.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-2.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-3.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-4.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-5.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-1.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-2.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-3.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-4.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-5.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-1.jpg", width: 800, height: 1000 },
                        { url: "/imgs/hero-2.jpg", width: 800, height: 1000 }
                    ],
                    titleCta: {
                        label: lang === 'en' ? "View Map" : "Xem bản đồ",
                        link: { type: 'internal', path: "/map" }
                    },
                    overview: {
                        title: lang === 'en' ? "FITCITY IN NUMBERS" : "FITCITY QUA NHỮNG CON SỐ",
                        list: [
                            { label: lang === 'en' ? "Clubs" : "Câu lạc bộ", value: "15+" },
                            { label: lang === 'en' ? "Members" : "Hội viên", value: "50k+" },
                            { label: lang === 'en' ? "Classes" : "Lớp học/Tuần", value: "200+" }
                        ]
                    }
                }
            },
            {
                name: "BoldTypography",
                props: {
                    firstWord: lang === 'en' ? "NOT JUST" : "FITNESS",
                    secondWord: lang === 'en' ? "IT'S FITNESS" : "STRONG",
                    background: { type: "video", url: "/videos/clubs.mp4", width: 1920, height: 1080 }
                }
            },
            {
                name: "ClassesShowcase",
                props: {
                    title: lang === 'en' ? "CLASSES" : "LỚP HỌC",
                    description: lang === 'en' ? "DIVERSE TRAINING EXPERIENCE" : "TRẢI NGHIỆM TẬP LUYỆN ĐA DẠNG",
                    list: [
                        {
                            title: "Yoga",
                            link: { type: 'internal', path: "/yoga" },
                            media: [
                                { type: "image", url: "/imgs/hero-3.jpg", width: 800, height: 1000 },
                                { type: "video", url: "/videos/yoga.mp4", width: 800, height: 1000 }
                            ]
                        },
                        {
                            title: "Zumba",
                            link: { type: 'internal', path: "/zumba" },
                            media: [
                                { type: "image", url: "/imgs/hero-2.jpg", width: 800, height: 1000 },
                                { type: "video", url: "/videos/zumba.mp4", width: 800, height: 1000 }
                            ]
                        },
                        {
                            title: "Training",
                            link: { type: 'internal', path: "/training" },
                            media: [
                                { type: "image", url: "/imgs/hero-1.jpg", width: 800, height: 1000 },
                                { type: "video", url: "/videos/training.mp4", width: 800, height: 1000 }
                            ]
                        },
                        {
                            title: "Pilates",
                            link: { type: 'internal', path: "/pilates" },
                            media: [
                                { type: "image", url: "/imgs/hero-4.jpg", width: 800, height: 1000 },
                                { type: "video", url: "/videos/yoga.mp4", width: 800, height: 1000 }
                            ]
                        }
                    ],
                    ctaList: [
                        { label: lang === 'en' ? "View Schedule" : "Xem lịch học", link: { type: 'internal', path: "/schedule" } }
                    ],
                    page: "main"
                }
            }


        ]
    }
})

