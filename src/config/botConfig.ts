export const botConfig = {
// Turn off-on systems individually
    slashCommands: true,
    registrationSystem: true,
    loadingCardsSystem: true,

    token: process.env.BOT_TOKEN as string,
    mongoURL: process.env.MONGO_URI as string,
    botId: "784331916722700288",
    guildId: "1123714610638360646",

// Category ID's
    registerCategoryId: "1126446173369143296",
    tavoPokalbiaiCategoryId: "1128400129498558520",
    informacijaCategoryId: "1128400366443167885",
    pagrindinisKavineCategoryId: "1128399673435115580",
    voiceKanalaiCategoryId: "1167553171472797767",
    forumCinemasCategoryId: "1305209278033825854",
    administracijaCategoryId: "1124982810562793472",
// Roles ID's
    narysRoleId: "1126446265186668564",
// Channels ID's
    profilisChannelId: "1128404322045136998",
    bendrasChannelId: "1305206971464683541",
    naujokamsChannelId: "1124323472873635890",
    naujienosChannelId: "1305200306648518656",
    adminLogsChannelId: "1125348589531574302",
    swipingChannelId: "1339507235063201844",
}