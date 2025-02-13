export const systems = Object.freeze({
    slashCommands: true,

    registration: true,
    loadingCards: true,
    tinder: true,
});

export const botId = "784331916722700288";
export const guildId = "1123714610638360646";

export const secrets = Object.freeze({
    token: process.env.BOT_TOKEN as string,
    mongoURL: process.env.MONGO_URI as string,
});

export const categoryId = Object.freeze({
    register: "1126446173369143296",
    tavoPokalbiai: "1128400129498558520",
    informacija: "1128400366443167885",
    pagrindinisKavine: "1128399673435115580",
    voiceKanalai: "1167553171472797767",
    forumCinemas: "1305209278033825854",
    administracija: "1124982810562793472",
});

export const channelsId = Object.freeze({
    profilis: "1128404322045136998",
    bendras: "1305206971464683541",
    naujokams: "1124323472873635890",
    naujienos: "1305200306648518656",
    adminLogs: "1125348589531574302",
    swiping: "1339507235063201844",
})

export const rolesId = Object.freeze({
    narys: "1126446265186668564",
});
