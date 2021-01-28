import i18n from '@/lang'

export function getPageTitle(title) {
    const key = i18n.te('route.' + title)
    if (key) {
        const transTitle = i18n.t('route.' + title)
        return transTitle
    }
    return title
}
