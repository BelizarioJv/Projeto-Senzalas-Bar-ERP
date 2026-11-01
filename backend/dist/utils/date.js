// Data de hoje (zerando horas)
export function getStartOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
// Início do mês
export function getStartOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}
// Fim do mês
export function getEndOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}
// Retorna a data exata do 5º dia útil do mês atual
export function getFifthBusinessDayOfCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let businessDaysCount = 0;
    let day = 1;
    while (businessDaysCount < 5) {
        const currentDate = new Date(year, month, day);
        const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 6 = Sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        if (!isWeekend) {
            businessDaysCount++;
        }
        if (businessDaysCount === 5) {
            return currentDate;
        }
        day++;
    }
    // Fallback de segurança (início do mês)
    return getStartOfMonth();
}
// Compara se hoje é o 5º dia útil
export function isTodayFifthBusinessDay() {
    const today = getStartOfToday();
    const fifthBusinessDay = getFifthBusinessDayOfCurrentMonth();
    return today.getTime() === fifthBusinessDay.getTime();
}
