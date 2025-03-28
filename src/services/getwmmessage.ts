export const getwmmessage = async () => {
    const messages = [
        {"4/13/25":"Central Users: L7 lateral scheduled maintenance outage 4/01"},
        {"2/15/25":"Schedule out 10 days"},
        {"3/21/25":"Schedule out 10 days"},
        {"5/1/25":"Schedule out 10 days"},
        {"2/15/25":"Schedule out 10 days"},
        {"3/21/25":"Schedule out 10 days"},
        {"5/1/25":"Schedule out 10 days"},
        {"2/15/25":"Schedule out 10 days"},
        {"3/21/25":"Schedule out 10 days"},
        {"5/1/25":"Schedule out 10 days"},
        {"6/20/25":"*Urgent* Delivery Laterals with delays due to high damand:\nN-line: 7+days\nT-line below Lovelock hwy: 7+ days\nA15 lateral: 5+days\nL1 below Shurz hwy: 6+days"}
    ]
    // order of messages by date
    messages.sort((a, b) => {
        const dateA = new Date(Object.keys(a)[0]);
        const dateB = new Date(Object.keys(b)[0]);
        return dateB.getTime() - dateA.getTime();
    });

    // const response = await fetch(`${API_URL}/wmmessage`, {
    //     method: 'GET',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     },
    // });
    return messages;
}
