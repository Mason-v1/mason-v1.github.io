(function () {
    const storageKey = "masonapps-language";

    const translations = {
        zh: {
            pageTitle: "MasonApps | Apple 平台产品",
            pageDescription: "Mason 的 Apple 平台产品主页，展示 Artino、Rovo Cam、LiveToFrame 等 iOS 与 macOS 应用。",
            navAria: "页面导航",
            languageSwitcherAria: "语言切换",
            spotlightAria: "重点 App",
            otherProductsAria: "其余产品",
            navProducts: "产品",
            navManifesto: "理念",
            navContact: "联系",
            heroTitle: "为 Apple 平台做清爽的小工具。",
            heroCopy: "我做一些清爽、顺手、面向真实场景的 iOS / macOS 产品。现在重点在相机、Live Photo 和影像创作相关工具上，把复杂操作收进安静的界面里。",
            downloadArtino: "下载 Artino",
            viewProducts: "查看主推产品",
            appStoreDownload: "App Store 下载",
            downloadOnAppStore: "在 App Store 下载",
            download: "下载",
            featuredLabel: "主推产品",
            featuredTitle: "最近重点推进的三款产品。",
            otherProducts: "其余产品",
            artinoBadge: "新上架",
            artinoMeta: "照片 Zine · iOS / iPadOS / macOS",
            artinoPlatform: "iPhone / iPad / Mac",
            artinoPrivacy: "未收集数据",
            rovoMeta: "相机工具 · iOS / iPadOS",
            liveToFrameMeta: "Live Photo · iOS",
            photoFramifyMeta: "照片装裱 · iOS / macOS",
            artinoShort: "照片 Zine / 迷你杂志生成工具",
            rovoShort: "带构图引导的胶片相机",
            liveToFrameShort: "Live Photo、GIF 和视频帧导出",
            photoFramifyShort: "照片边框、水印和拼贴布局",
            photoCollageShort: "拼图、模板和九宫格切图流程",
            didMoreShort: "轻量习惯记录，把坚持变成低压力反馈。",
            emotifyShort: "更轻的表情包与表达内容创作工具。",
            liplyShort: "AI 口红试色镜，实时预览和收藏适合自己的色号。",
            liftShort: "简洁的健身训练记录，专注动作、重量和进步轨迹。",
            pixSafeShort: "分享前清理照片里的隐私信息。",
            artinoDesc: "把照片快速生成有杂志感的 Zine，从模板、排版到导出，给日常影像一个更完整的呈现方式。",
            rovoDesc: "把拍摄体验做得更直接、更干净，减少设置负担，留下最常用的相机动作。",
            liveToFrameDesc: "把 Live Photo 里的片刻抽出来，变成可以保存、分享和回看的画框记忆。",
            photoFramifyDesc: "给照片加边框、水印与拼贴布局，用简单流程做出更完整的发布图。",
            rovoProof: "App Store 5.0 / 5 · 40 条评分",
            liveToFrameProof: "App Store 已有多个评分",
            photoFramifyProof: "App Store 十余条评分",
            manifestoLabel: "产品理念",
            manifestoOneTitle: "从真实场景开始",
            manifestoOneCopy: "先看用户在什么时候卡住，再决定功能要不要存在。产品不追求大而全，而是让一个具体动作更顺。",
            manifestoTwoTitle: "本地优先，少收集",
            manifestoTwoCopy: "照片、相机、习惯和创作工具都尽量在设备上完成处理。没有必要上传的数据，就不要碰。",
            manifestoThreeTitle: "安静但有质感",
            manifestoThreeCopy: "界面应该把注意力还给内容本身。默认状态要轻，关键动作要明显，细节要经得起反复使用。",
            contactLabel: "联系",
            contactTitle: "产品合作、支持反馈，或者聊聊新的小工具。",
            email: "邮箱"
        },
        en: {
            pageTitle: "MasonApps | Apple Platform Products",
            pageDescription: "Mason's Apple platform product home, featuring Artino, Rovo Cam, LiveToFrame, and other iOS and macOS apps.",
            navAria: "Page navigation",
            languageSwitcherAria: "Language switcher",
            spotlightAria: "Spotlight app",
            otherProductsAria: "Other products",
            navProducts: "Products",
            navManifesto: "Manifesto",
            navContact: "Contact",
            heroTitle: "Quiet little tools for Apple platforms.",
            heroCopy: "I build focused iOS and macOS products for real everyday moments. Right now I am exploring camera, Live Photo, and image-making tools that keep complex actions inside calm interfaces.",
            downloadArtino: "Download Artino",
            viewProducts: "View featured products",
            appStoreDownload: "App Store",
            downloadOnAppStore: "Download on the App Store",
            download: "Get",
            featuredLabel: "Featured",
            featuredTitle: "Three products I am pushing forward now.",
            otherProducts: "Other products",
            artinoBadge: "New on the App Store",
            artinoMeta: "Photo Zine · iOS / iPadOS / macOS",
            artinoPlatform: "iPhone / iPad / Mac",
            artinoPrivacy: "No data collected",
            rovoMeta: "Camera tool · iOS / iPadOS",
            liveToFrameMeta: "Live Photo · iOS",
            photoFramifyMeta: "Photo framing · iOS / macOS",
            artinoShort: "Photo zine and mini magazine maker",
            rovoShort: "A guided film camera for better composition",
            liveToFrameShort: "Live Photo, GIF, and video frame export",
            photoFramifyShort: "Photo frames, watermarks, and collage layouts",
            photoCollageShort: "Collage, template, and grid-cut workflow",
            didMoreShort: "A lightweight habit log that keeps progress low-pressure.",
            emotifyShort: "A lighter tool for stickers, memes, and expressive images.",
            liplyShort: "AI lipstick try-on with live preview and saved shades.",
            liftShort: "A clean workout log for exercises, weights, and progress.",
            pixSafeShort: "Clean photo privacy before sharing.",
            artinoDesc: "Turn photo sets into zines with a magazine feel, from templates and layout to export, so everyday images get a more complete presentation.",
            rovoDesc: "Make shooting more direct and cleaner by reducing setup friction and keeping the camera actions you actually use.",
            liveToFrameDesc: "Pull moments out of Live Photos and turn them into framed memories you can save, share, and revisit.",
            photoFramifyDesc: "Add frames, watermarks, and collage layouts to photos through a simple flow for more polished sharing images.",
            rovoProof: "App Store 5.0 / 5 · 40 ratings",
            liveToFrameProof: "Several App Store ratings",
            photoFramifyProof: "10+ App Store ratings",
            manifestoLabel: "Manifesto",
            manifestoOneTitle: "Start from real situations",
            manifestoOneCopy: "I look for the moment where people get stuck before deciding whether a feature should exist. A product does not need to do everything; it should make one action smoother.",
            manifestoTwoTitle: "Local first, less collection",
            manifestoTwoCopy: "Photos, camera flows, habits, and creative tools should do as much as possible on device. Data that does not need to be uploaded should stay untouched.",
            manifestoThreeTitle: "Quiet, but crafted",
            manifestoThreeCopy: "The interface should give attention back to the content. Defaults should feel light, important actions should be clear, and details should hold up under repeated use.",
            contactLabel: "Contact",
            contactTitle: "For product collaboration, support feedback, or a conversation about new little tools.",
            email: "Email"
        }
    };

    function readStoredLanguage() {
        try {
            const stored = window.localStorage.getItem(storageKey);
            return stored === "zh" || stored === "en" ? stored : null;
        } catch (error) {
            return null;
        }
    }

    function writeStoredLanguage(language) {
        try {
            window.localStorage.setItem(storageKey, language);
        } catch (error) {
            // Local storage can be unavailable in private or restricted browsing.
        }
    }

    function detectBrowserLanguage() {
        const languages = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language || "en"];
        return languages[0].toLowerCase().startsWith("zh") ? "zh" : "en";
    }

    function applyLanguage(language, shouldStore) {
        const dictionary = translations[language] || translations.en;
        document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
        document.documentElement.dataset.lang = language;
        document.title = dictionary.pageTitle;

        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute("content", dictionary.pageDescription);
        }

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            if (dictionary[key]) {
                element.textContent = dictionary[key];
            }
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const key = element.dataset.i18nAriaLabel;
            if (dictionary[key]) {
                element.setAttribute("aria-label", dictionary[key]);
            }
        });

        document.querySelectorAll("[data-lang-option]").forEach((button) => {
            const isActive = button.dataset.langOption === language;
            button.setAttribute("aria-pressed", String(isActive));
        });

        if (shouldStore) {
            writeStoredLanguage(language);
        }
    }

    const initialLanguage = readStoredLanguage() || detectBrowserLanguage();
    applyLanguage(initialLanguage, false);

    document.querySelectorAll("[data-lang-option]").forEach((button) => {
        button.addEventListener("click", () => {
            const language = button.dataset.langOption;
            if (language === "zh" || language === "en") {
                applyLanguage(language, true);
            }
        });
    });
})();
