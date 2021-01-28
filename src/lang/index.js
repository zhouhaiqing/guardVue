import Vue from 'vue'

// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 本地资源文件，我这里配2个语言，中文&英文，src下根据个人情况放置
import zhLang from '@/lang/zh.js'
import enLang from '@/lang/en.js'

const i18n = new VueI18n({
    // 将要切换的语言，可以通过url拼的参数获取，用户行为select选择获取，本地manifest配置获取等，根据场景动态获取
    locale: sessionStorage.getItem('language') || 'zh',
    messages: {
        // ...  es6的拓展运算符，相当于解析出每个对象
        'zh': { ...zhLang, ...zhLocale },
        'en': { ...enLang, ...enLocale }
    }
})

export default i18n
