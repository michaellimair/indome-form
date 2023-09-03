const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
export const formatDate = (dt: Date) => dateTimeFormat.format(dt);