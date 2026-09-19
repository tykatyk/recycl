import { ru } from '@recycl/shared/dist/i18n'
const { WasteTypes } = ru

export default {
  Header: {
    navigation: {
      collectionPoints: 'Пункты приема вторсырья',
      ads: 'Наличие вторсырья',
    },
    actions: {
      add: 'Добавить',
      createAd: 'Объявление о наличии вторсырья',
      createCollectionPoint: 'Пункт приема вторсырья',
    },
    userMenu: {
      header: 'Мои',
      myAds: 'Обьявления о наличии вторсырья',
      myCollectionPoints: 'Пункты приема вторсырья',
      mySubscriptions: 'Подписки на уведомления',
      mySettings: 'Настройки',
      logIn: 'Войти',
      logOut: 'Выйти',
    },
  },
  Footer: {
    contactUs: ' Связаться с нами',
    supportUs: ' Поддержать проект',
  },
  RegisterPage: {
    title: 'Регистрация',
    h1: 'Регистрация',
    successMessage: 'Регистрация успешна. Теперь вы можете войти',
    errorMessage: 'Что то пошло не так',
    userExists: 'Пользователь с таким email уже зарегистрирован',
    form: {
      yourName: 'Имя или название организации',
      yourEmail: 'Электронная почта',
      submit: 'Зарегистрироваться',
      logIn: 'Вход',
    },
  },
  LoginPage: {
    title: 'Вход',
    h1: 'Вход',
    userNotFound: 'Пользователь с таким email не найден',
    linkSent: 'На вашу электронную почту отправлена ссылка для входа',
    signInWithGoogle: 'Войти через Google',
    yourEmail: 'Адрес электронной почты',
    submit: 'Войти',
    signUp: 'Регистрация',
    errorMessage: 'Что то пошло не так',
  },
  AuthErrorPage: {
    title: 'Ошибка входа',
    homeBtn: 'На главную',
    errorMessage: 'Не удалось выполнить вход',
    linkInvalid: 'Возможно ссылка для входа больше не действительна',
  },
  HomePage: {
    h1: 'Помогаем находить и сдавать на переработку вторсырье и отходы',
    title: 'Главная',
    whatWePropose: {
      h2: 'Что мы предлагаем',
      forRecyclers: {
        title: 'Для тех, кто принимает или перерабатывает вторсырье и отходы',
        findAds:
          'Находите объявления о наличии вторсырья, которое пользователи хотят передать на переработку или утилизацию.',
        addCollectionPoints:
          'Добавляйте информацию о местоположении стационарных или передвижных пунктов приема вторсырья, а также об сортировочных контейнерах.',
        subscribe:
          'Подпишитесь на получение уведомлений о появлении неподалеку от вас вторсырья, которое вы принимаете или перерабатываете.',
      },
      forSellers: {
        title:
          'Для тех, кто хочет сдать вторсырье на переработку или утилизацию',
        findCollectionPoints: 'Находите пункты приема вторсырья вблизи от вас.',
        createAd:
          'Добавляйте объявления о наличии у вас вторсырья, которое вы хотите сдать на переработку или утилизацию.',
        subscribe:
          'Подпишитесь на получение уведомлений о появлении вблизи от вас пунктов приема вторсырья.',
      },
    },
    howItWorks: {
      h2: 'Как это работает',
      addAds:
        'Пользователи размещают объявления о наличии у них вторсырья, которое они хотят сдать на переработку/утилизацию.',
      seeAds: 'Приемщики вторсырья видят эти объявления на карте.',
      addCollectionPoints:
        'Приемщики вторсырья добавляют информацию о передвижном пункте приема вторсырья, в регионе, где размещены объявления, указывая дату и место приема.',
      receiveNotifications:
        'Пользователи, разместившие объявления, получают уведомления о появлении в их регионе пункта приема вторсырья',
      passWaste:
        ' В указанную дату пользователи сдают вторсырье на переработку или утилизацию.',
    },
  },
  MyCollectionPointsPage: {
    title: 'Мои контейнеры для приема вторсырья',
    h1: 'Мои контейнеры для приема вторсырья',
  },
  MyMobileCollectionPointsPage: {
    title: 'Мои передвижные пункты приема вторсырья',
    h1: 'Мои передвижные пункты приема вторсырья',
  },
  MyStationeryCollectionPointsPage: {
    title: 'Мои стационарные пункты приема вторсырья',
    h1: 'Мои стационарные пункты приема вторсырья',
  },
  CreateCollectionPointPage: {
    title: 'Выберите тип пункта приема вторсырья',
    selectCollectionPointType:
      'Выберите тип пункта приема вторсырья, который вы хотите создать',
    inputLabel: 'Тип пункта приема вторсырья',
    selectLabel: 'Тип пункта приема вторсырья',
    submit: 'Выбрать',
  },
  CreateContainerCollectionPointPage: {
    title: 'Добавить контейнер сбора вторсырья',
    h1: 'Добавить контейнер сбора вторсырья',
  },
  CreateMobileCollectionPointPage: {
    title: 'Добавить передвижной пункт сбора вторсырья',
    h1: 'Добавить передвижной пункт сбора вторсырья',
  },
  CreateStationeryCollectionPointPage: {
    title: 'Добавить стационарный пункт сбора вторсырья',
    h1: 'Добавить стационарный пункт сбора вторсырья',
  },
  CollectionPointFormCreate: {
    errorMessage: 'Ошибка при сохранении документа',
  },
  EditContainerCollectionPointPage: {
    h1: 'Редактировать информацию о контейнере приема вторсырья',
    title: 'Редактировать информацию о контейнере приема вторсырья',
  },
  EditMobileCollectionPointPage: {
    h1: 'Редактировать информацию о передвижном пункте приема вторсырья',
    title: 'Редактировать информацию о передвижном пункте приема вторсырья',
  },
  EditStationeryCollectionPointPage: {
    h1: 'Редактировать информацию о стационарном пункте приема вторсырья',
    title: 'Редактировать информацию о стационарном пункте приема вторсырья',
  },
  CollectionPointFormUpdate: {
    errorMessage: 'Возникла ошибка при сохранении заявки',
    form: {
      date: {
        label: 'Дата и время начала приема вторсырья',
        helperText: 'Обязательное поле',
      },
      phone: {
        label: 'Контактный телефон',
        helperText: 'Обязательное поле',
      },
      location: {
        label: {
          mobile: 'Место приема вторсырья',
          stationary: 'Местоположение пункта приема вторсырья',
          container: 'Местоположение сортировочного контейнера',
        },
        helperText: 'Обязательное поле',
      },
      wasteType: {
        label: 'Типы принимаемого вторсырья',
        helperText: 'Обязательное поле',
      },
      comment: {
        label: 'Описание',
      },
      submit: 'Сохранить',
      description: {
        intro: 'Пункты приема вторсырья делятся на три вида:',
        types: {
          sortingContainers: 'Сортировочные контейнеры.',
          mobilePoints: 'Передвижные (мобильные) пункты.',
          stationaryPoints: 'Стационарные пункты.',
        },
        sortingContainers:
          'Сортировочные контейнеры это любые емкости для сбора вторсырья, которые устанавливаются в магазинах, торговых центрах или на улице. Например коробки для сбора отработанных батареек, текстиля и т.д.',
        mobilePoints:
          'Передвижные (мобильные) пункты, это пункты которые принимают вторсырье в определенное время и в определенном месте. При добавлении этих пунктов необходимо указать дату начала события по сбору вторсырья.',
        stationaryPoints:
          'Стационарные пункты, это площадки или здания где принимают вторсырье.',
        requirements:
          'При добавлении пункта приема вторсырья необходимо указать его вид, местоположение, типы вторсырья, которые принимаются этим пунктом, а также контактный телефон лица, отвечающего за данный пункт.',
      },
    },
  },
  MyAdsPage: {
    title: 'Мои обьявления о наличии вторсырья',
    h1: 'Мои обьявления о наличии вторсырья',
  },
  CreateAdPage: {
    title: 'Добавить объявление о наличии вторсырья',
    h1: 'Добавить объявление о наличии вторсырья',
  },
  EditAdPage: {
    title: 'Редактировать объявление о наличии вторсырья',
    h1: 'Редактировать объявление о наличии вторсырья',
  },
  MyAdsDisabledPage: {
    title: 'Мои неактивные обьявления о наличии вторсырья',
    h1: 'Мои неактивные обьявления о наличии вторсырья',
  },
  MyAdsList: {
    selectRow: 'Выбрать строку',
    editBtn: 'Редактировать',
    deactivateBtn: 'Деактивировать',
    activateBtn: 'Активировать',
    deactivateSelected: 'Деактивировать выбранные',
    activateSelected: 'Активировать выбранные',
    deleteBtn: 'Удалить',
    fetchDataError: 'Не удалось загрузить данные',
    deletionError: 'Ошибка при удалении объявления',
    deletionSuccess: 'Объявление удалено',
    deactivationSuccess: 'Объявление деактивировано',
    deactivationError: 'Не удалось деактивировать объявление',
    activationSuccess: 'Объявление активировано',
    activationError: 'Не удалось активировать объявление',
    data: {
      wasteLocation: 'Местоположение вторсырья',
      wasteType: 'Вид вторсырья',
      wasteWeight: 'Вес вторсырья',
      quantity: '{quantity} кг',
      adActiveUpTo: 'Объявление активно до',
    },
  },
  MyCollectionPointsList: {
    editBtn: 'Редактировать',
    deleteBtn: 'Удалить',
    dataFetchingError: 'Не удалось загрузить данные',
    deletionError: 'Ошибка при удалении элемента',
    deletionSuccess: 'Элемент удален',
    selectRow: 'Выбрать строку',
    data: {
      wasteTypes: 'Виды вторсырья, которые принимаются',
      collectionPointType: 'Тип пункта приема вторсырья',
      mobile: {
        date: 'Дата и время события',
      },
    },
  },
  CollectionPointTypes: {
    stationery: 'Стационарный',
    mobile: 'Передвижной',
    container: 'Сортировочный контейнер',
  },
  CollectionPointsOnMap: {
    title: 'Карта пунктов приема вторсырья',
    errorMessage: 'Что-то пошло не так',
  },
  UserLocationComponent: {
    intro: 'Мы не смогли определить местоположение для отображения карты',
    selectLocation: 'Выберите, пожалуйста, населенный пункт вручную',
    errorMessage: 'Не удалось получить координаты населенного пункта',
    form: {
      userLocation: {
        label: 'Населенный пункт',
        helperText: 'Обязательное поле',
      },
      submit: 'Продолжить',
    },
  },
  Marker: {
    IndividualAdContent: {
      wasteWeight: 'Вес вторсырья в объявлении: {weight} кг.',
      view: 'Посмотреть',
    },
    AggregatedAdContent: {
      title: 'В данной локации несколько объявлений',
      wasteWeight: 'Вес вторсырья в данной локации: {weight} кг.',
      view: 'Посмотреть',
    },
    IndividualCollectionPointContent: {
      collectionPointType: 'Тип пункта приема вторсырья',
      date: ' Дата и время приема вторсырья',
      collectedWasteTypes: 'Виды вторсырья, которые принимаются',
      phone: 'Телефон',
      view: 'Посмотреть',
    },
    AggregatedCollectionPointContent: {
      title: 'В данной локации несколько пунктов приема',
      view: 'Посмотреть',
    },
  },
  AdsOnMap: {
    title: 'Карта наличия вторсырья',
    metaDescription:
      'Карта наличия вторсырья, доступного для переработки или утилизации',
    errorMessage: 'Что-то пошло не так',
  },
  DataGridFooter: {
    label: 'Показывать по',
  },
  CollectionPointTabs: {
    ariaLabel: 'Мои пункты приема вторсырья',
    containerLabel: 'Контейнеры',
    mobileLabel: 'Передвижные',
    stationaryLabel: 'Стационарные',
  },
  NoRows: {
    noData: 'Нет данных',
  },
  HeadingWithDescription: {
    title: 'Подробнее об этом',
  },
  AdsDescription: {
    general:
      'Объявление о наличии вторсырья позволяет опубликовать информацию о наличии у вас вторсырья, которое вы готовы передать на переработку или утилизацию. Оно будет особенно полезно тем пользователям, у которых рядом нет пунктов приема вторсырья данного вида.',
    receiveNotification:
      'После добавления объявления, организации, которые занимаются сбором или переработкой данного вида вторсырья смогут увидеть ваше объявление и получат уведомление о добавлении нового объявления.',
    subscribe: 'Вы также можете подписаться на получение',
    linkText: 'уведомлений',
    collectionPointsAvailable:
      'о появлении пунктов приема вторсырья указанного в ваших объявлениях.',
  },
  ActionsBar: {
    selectAll: 'Выбрать все',
    selected: 'Выбрано {selectedCount} из {total}',
    deleteSelected: 'Удалить выбранные',
  },
  AdTabs: {
    myAds: 'Мои объявления о наличии вторсырья',
    active: 'Активные',
    inactive: 'Неактивные',
  },
  SupportUsPage: {
    title: 'Поддержать проект',
    h1: 'Если вы хотите помочь проекту, то можете сделать это одним из перечисленных ниже способов',
  },
  ContactUsPage: {
    title: 'Связаться с нами',
    h1: 'Если у вас есть вопросы, предложения или замечания относительно работы сайта, заполните, пожалуйста, приведенную ниже форму и мы свяжемся с вами в ближайшее время',
    successMessage: 'Сообщение успешно отправлено',
    errorMessage: 'Ошибка при отправкве формы',
    remainedSymbols: 'Осталось',
    form: {
      subject: 'Тема письма',
      yourName: 'Ваше имя',
      yourEmail: 'Email для обратной связи',
      message: 'Текст сообщения',
      submit: 'Отправить',
    },
  },
  ServerErrorPage: {
    title: 'Ошибка сервера',
    content: 'На сервере возникла неизвестная ошибка',
  },
  NotFoundErrorPage: {
    title: 'Страница не найдена',
    content: 'Запрашиваемая вами страница не найдена на этом сервере',
  },
  AdsOnListPage: {
    title: 'Объявления о наличии вторсырья',
    metaDescription: 'Найти вторсырье для переработки или утилизации',
    sidebarHeader: 'Объявления о наличии вторсырья',
    wasteLocation: 'Местоположение вторсырья',
    lastUpdate: 'Последее обновление',
    viewItem: 'Посмотреть',
    errorMessage: 'Что-то пошло не так',
    howSearchWorks:
      "При поиске по местоположению объявления ищутся только в указанной точке. Например, при указанном местоположении 'Винница', вы увидите объявления, в которых местоположение указано как 'Винница', но не 'ул. Пирогова, Винница', 'ул. Келецакая, Винница' и т. д. Для поиска по региону, рекомендуем кроме местоположения также указывать радиус поиска.",
  },
  MySubscriptionsPage: {
    title: 'Мои подписки на получение уведомлений',
    errorMessage: 'Что то пошло не так',
    enabled: 'Включено',
    disabled: 'Выключено',
    configBtn: 'Настроить',
  },

  SubscriptionDetails: {
    wasteAvailable: {
      title: 'Получать уведомления о появлении в моем регионе вторсырья',
      description:
        'Подписка предназначена для тех, кто занимается сбором вторсырья для дальнейшей переработки или утилизации. Она позволяет находить сырье, которое вам нужно, в местах, в которых вы работаете. Для добавления подписки укажите местоположение, относительно которого будет производится поиск, радиус поиска и один или несколько видов вторсырья. После добавления подписки, вы будете получать уведомления на электронную почту о новых объявлениях о наличии вторсырья.',
    },
    wasteRemoval: {
      title:
        'Получать уведомления появлении в моем регионе пунктов приема вторсырья',
      description:
        'Подписка предназначена для тех, кто хочет сдать вторсырье на переработку, но поблизости нет пунктов приема. После активации подписки, система будет производить поиск пунктов приема тех видов вторсырья, которые указаны в ваших объявлениях о наличии вторсырья. Поиск будет производиться в указанном вами радиусе. При появлении новых пунктов приема, вы получите уведомление на электронную почту.',
    },
  },

  WasteAvailableForm: {
    unknownError: 'Что то пошло не так',
    documentCreated: 'Документ создан',
    documentUpdated: 'Документ обновлен',
    dataLoadingError: 'Возникла ошибка при загрузке данных',
    form: {
      adTitle: 'Заголовок объявления',
      adTitleHelperText: 'Обязательное поле',
      wasteLocation: 'Местоположение вторсырья',
      wasteLocationHelperText: 'Обязательное поле',
      wasteType: 'Тип вторсырья',
      wasteTypeHelperText: 'Обязательное поле',
      quantity: 'Количество, кг',
      quantityHelperText: 'Обязательное поле',
      quantityEndAdornment: 'кг',
      phone: 'Контактный телефон',
      phoneHelperText: 'Обязательное поле',
      comment: 'Комментарий',
      submit: 'Сохранить',
    },
  },
  ErrorComponent: {
    homeBtn: 'На главную',
  },
  DataLoadingError: {
    errorMessage: 'Ошибка при загрузке данных',
  },
  MapActionButton: {
    showPanel: 'Скрыть панель',
    hidePanel: 'Показать панель',
  },
  AdSidebarItemsMap: {
    wasteType: 'Тип вторсырья',
  },
  AdSidebarItemsList: {
    errorMessage: 'Что-то пошло не так',
    form: {
      wasteTypeLabel: 'Тип вторсырья',
      wasteLocationLabel: 'Местоположение',
      searchRadiusLabel: 'Радиус поиска, км',
      howSearchWorksBtn: 'Как работает поиск',
      submitBtn: 'Поиск',
    },
  },
  AdSidebarChangeView: {
    viewOnList: 'Смотреть списком',
    viewOnMap: 'Смотреть на карте',
  },
  AdSidebarItemsCommon: {
    noWasteType: 'Нет нужного типа вторсырья в списке',
    writeToAdmin: 'Написать администратору',
    supportUs: 'Поддержать проект',
  },
  ProposeWasteType: {
    errorMessage: 'Ошибка при отправкве формы',
    successMessage: 'Сообщение успешно отправлено',
    header:
      ' Если вы не нашли нужного вам типа вторсырья в списке, вы можете отправить запрос на его добавление',
    headerDetails:
      'О результате рассмотрения запроса, мы известим вас на электронную почту',
    remainedSymbols: 'Осталось',
    form: {
      yourName: 'Ваше имя',
      yourEmail: 'Email для обратной связи',
      wasteTypeToAdd: 'Тип вторсырья, который вы хотите добавить',
      additionalNotes: 'Примечание',
      submit: 'Отправить',
    },
  },
  LocaleSwitcher: {
    switchLocale: '{locale, select, uk {УКР} ru {РУС} other {Unknown}}',
  },
  PageLayout: {
    pageTitle: 'next-intl',
  },
  SuccessfullUnsubscribe: {
    successMessage: 'Вы успешно отписались от рассылки',
    resubscribe: ' Подписаться снова',
  },
  TokenNotFound: {
    errorMessage: 'Что то пошло не так',
    incorrectEmail: 'Недействительный адрес электронной почты',
    userNotFound: 'Пользователь с таким email не найден',
    letterSent: 'Письмо отправлено. Проверьте электронную почту',
    addressNotSubscribed: 'Этот email не подписан ни на одну рассылку',
    linkNotValid: 'Эта ссылка больше не действительна',
    unsubscribeAll:
      'Для отписки от всех рассылок перейдите по ссылке из письма, которое мы вам отправим.',
    youCan: 'Вы также можете',
    selectSubscriptions: 'выбрать рассылки',
    youAreInterestedIn: 'которые вам интересны',
    form: {
      yourEmail: {
        helperText: 'Обязательное поле',
      },
      submit: 'Отправить',
    },
  },
  NoData: {
    title: 'Еще нет ни одной подписки',
    helperText:
      'Укажите типы вторсырья, которые вас интересуют и добавьте регион поиска',
    addItem: 'Добавить',
  },
  SubscriptionList: {
    editBtn: 'Редактировать',
    deleteBtn: 'Удалить',
    fetchDataError: 'Не удалось загрузить данные',
    deleteSelected: 'Удалить выбранные',
    deletionError: 'Ошибка при удалении элемента',
    deletionSuccess: 'Элемент удален',
    selectRow: 'Выбрать строку',
    whereToSearch: 'Где искать',
    whatToSearch: 'Что искать',
    searchRadius: 'Радиус поиска: {radius} км',
  },
  WasteAvailableSubscriptions: {
    title: 'Мои подписки на получение уведомлений о появлении вторсырья',
  },
  WasteRemovalSubscriptionPage: {
    title: 'Указать радиус поиска пунктов приема вторсырья',
    errorMessage: 'Что то пошло не так',
    successMessage: 'Значение сохранено',
    notSubscribed:
      'У вас отключены уведомления о появлении пунктов приема вторсырья',
    h1: 'Укажите радиус поиска пунктов приема вторсырья, указанного в ваших обьявлениях',
    form: {
      searchRadius: {
        label: 'Радиус поиска, км',
        helperText: 'Обязательное поле',
        endAdornment: 'Км',
      },
      submit: 'Сохранить',
    },
    backBtn: 'Вернуться',
  },
  CreateUpdateWasteAvailableSubscription: {
    createTitle:
      'Создать подписку на получение уведомлений о появлении вторсырья',
    updateTitle:
      'Редактировать подписку на получение уведомлений о появлении вторсырья',
    errorMessage: 'Ошибка при сохранении данных',
    notSubscribed: 'У вас отключены уведомления о появлении вторсырья.',
    enableNotifications:
      'Чтобы добавить подписку, включите уведомления, перейдя по ссылке',
    configureSubscriptions: 'Управлять подписками',

    form: {
      location: {
        label: 'Местоположение',
        helperText: 'Обязательное поле',
      },
      searchRadius: {
        label: 'Радиус поиска, км',
        helperText: 'Обязательное поле',
        endAdornment: 'Км',
      },
      wasteTypes: {
        label: 'Типы вторсырья',
        helperText: 'Обязательное поле',
      },
      submit: 'Сохранить',
    },
  },
  PlacesAutocompleteComponent: {
    noVariants: 'Нет вариантов',
    loading: 'Загрузка',
    placeholder: 'Введите адрес',
  },
  AccountSettings: {
    title: 'Настройки аккаунта',
    changeContactData: 'Изменить контактные данные',
    changePhone: 'Изменить номер телефона',
    changeEmail: 'Изменить email-адрес',
    deleteAccount: 'Удалить аккаунт',
    PhoneForm: {
      successMessage: 'Данные успешно обновлены',
      errorMessage: 'Что то пошло не так',
      phoneInUse: 'Этот номер телефона уже используется',
      dataFetchingError: 'Ошибка при получении данных',
      label: 'Номер телефона',
      submit: 'Сохранить',
    },
    ChangeEmailForm: {
      successMessage: 'Письмо подтверждения отправлено на новый адрес',
      errorMessage: 'Что то пошло не так',
      emailInUse: 'Этот адрес уже используется',
      emailTheSameAsCurrent: 'Этот адрес уже установлен в качестве текущего',
      label: 'Новый email адрес',
      submit: 'Сохранить',
    },
    ContactsForm: {
      successMessage: 'Данные успешно обновлены',
      errorMessage: 'Что то пошло не так',
      userNameLabel: 'Имя или название организации',
      submit: 'Сохранить',
    },
    DeleteAccountComponent: {
      deleteBtn: 'Удалить аккаунт',
      successMessage: 'Ваш аккаунт удален',
      errorMessage: 'Что то пошло не так',
      confirmMessage:
        'Удаление аккаунта приведет к удалению всех ваших данных. Это действие нельзя отменить. Вы действительно хотите продолжить?',
      confirmTitle: 'Подтвердите удаление аккаунта',
    },
  },
  ChangeEmailPage: {
    title: 'Смена email',
    homeBtn: 'На главную',
    successMessage: 'Адрес электронной почты успешно изменен',
    errorMessage: 'Срок действия ссылки истек',
  },
  CollectionPointPage: {
    errorTitle: 'Это обьявление не доступно',
    successTitle: 'Пункт приема вторсырья {description}',
    vieOtherBtn: 'Смотреть другие',
  },
  SingleCollectionPoint: {
    errorMessage: 'Что то пошло не так',
    h1: 'Пункт приема вторсырья',
    location: 'Местоположение: {locationDescription}',
    collectionPointType: 'Тип',
    addedBy: 'Добавил: {userName}',
    startingDate: 'Дата и время начала',
    wasteTypes: 'Виды вторсырья, которые принимаются',
    contactPhone: 'Контактный телефон',
    showPhoneBtn: 'Показать',
    description: 'Опиcание',
    complain: 'Пожаловаться',
  },
  CollectionPointsListViewPage: {
    title: 'Список пунктов приема вторсырья',
    metaDescription: 'Найти пункт приема вторсырья',
    sidebarHeader: 'Пункты приема вторсырья',
    collectionPointLocation: 'Местоположение пункта приема',
    wasteTypes: ' Вторсырье, которое принимается',
    startingDate: 'Дата события',
    quantityDimension: 'кг',
    collectionPointType: 'Тип пункта приема',
    view: 'Посмотреть',
    errorMessage: 'Что-то пошло не так',
    howSearchWorks:
      'При поиске по местоположению пункты приема вторсырья ищутся только в указанной точке. Например, при указанном местоположении "Винница", вы увидите пункты приема, для которых местоположение указано как "Винница", но не "ул. Пирогова, Винница", "ул. Келецакая, Винница" и т. д. Для поиска по региону, рекомендуем кроме местоположения также указывать радиус поиска.',
  },
  SingleWasteAvailableAdPage: {
    ContentNotAvailable: {
      title: 'Это объявление не активно',
      backBtn: 'Назад',
    },
    wasteOn: 'Вторсырьё на',
  },
  SingleWasteAvailableAd: {
    errorMessage: 'Что то пошло не так',
    wasteType: 'Тип вторсырья',
    location: 'Местоположение',
    adCreated: 'Объявление создано',
    addedUser: 'Добавил',
    wasteWeight: 'Вес вторсырья',
    contactPhone: ' Контактный телефон',
    quantityDimension: 'кг',
    view: 'Показать',
    description: 'Опиcание',
    complain: 'Пожаловаться',
  },
  ValidationMessages: {
    required: 'Обязательное поле',
    positive: 'Поле должно содержать число больше 0',
    onlyDigits: 'Только цифры',
    onlyIntegers: 'Только целые числа',
    email: 'Недействительный email',
    phone: 'Недействительный номер телефона',
    notOnlySpaces: 'Строка не может состоять только из пробелов',
    wrongType: 'Значение имеет не верный тип данных',
    dateIsSameOrAfter: 'Дата/время меньше текущих',
    dateIsOneYearAfterNow: 'Нелязя выбирать даты в далеком будущем',
    atLeastOne: 'Выберите хотя бы 1 значение',
    maxLength:
      'Максимум {max, plural, one {# символ} few {# символа} other {# символов}}',
    minLength:
      'Минимум {min, plural, one {# символ} few {# символа} other {# символов}}',
    maxNumber: 'Значение не должно быть больше {max}',
    minNumber: 'Значение не должно быть меньше {min}',
    oneOf: 'Выберите один из вариантов',
  },
  ComplaintDialog: {
    title: 'Пожаловаться на контент',
    content: 'Опишите причину жалобы',
    label: 'Текст жалобы',
    cancel: 'Отменить',
    submit: 'Отправить',
    errorMessage: 'Что то пошло не так',
    successMessage: 'Сообщение успешно отправлено',
  },
  WasteTypes,
  CookieConsent: {
    weUseCookies:
      'Мы используем файлы cookie для улучшения качества работы сайта',
    ok: 'ok',
  },
}
