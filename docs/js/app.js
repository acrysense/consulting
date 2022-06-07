document.addEventListener('DOMContentLoaded', function () {
    // inputmask
    Inputmask().mask(document.querySelectorAll('input'))
    
    // height 100vh fix for IOS
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // resize
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    // checker
    const useItemChecker = (els, onClickOutside) => {
        const checkBodyClick = (e) => {
            let currentEl = e.target;

            while (currentEl) {
                if (els.includes(currentEl)) break;
                currentEl = currentEl.parentNode
            }

            if (!currentEl) {
                onClickOutside()
                removeBodyChecker()
            }
        }
        function setBodyChecker  ()  {
            document.documentElement.addEventListener('click', checkBodyClick)
        }
        function removeBodyChecker ()  {
            document.documentElement.removeEventListener('click', checkBodyClick)
        }
        return {setBodyChecker, removeBodyChecker}
    }
    
    // smooth scroll
    function currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;

        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
        
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;

        return 0;
    } 
    
    function elmYPosition(eID) {
        let elm = document.getElementById(eID);
        let y = elm.offsetTop;
        let node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        } return y;
    }
    
    function smoothScroll(eID) {
        let startY = currentYPosition();
        let stopY = elmYPosition(eID);
        let distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        let speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        let step = Math.round(distance / 25);
        let leapY = stopY > startY ? startY + step : startY - step;
        let timer = 0;
        if (stopY > startY) {
            for (let i = startY; i < stopY; i += step ) {
                setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for (let i = startY; i > stopY; i -= step ) {
            setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
    }

    // smooth scroll on all links
    const allLinks = document.querySelectorAll('a[href^="#"]')

    if (allLinks) {
        allLinks.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault()
        
                if (item.getAttribute('href').length > 1) {
                    smoothScroll(item.getAttribute('href').slice(1))
                }
            })
        })
    }

    // input control
    const allInput = document.querySelectorAll('.input-control__input')
    
    if (allInput) {
        allInput.forEach(item => {
            item.addEventListener('input', () => {
                const parent = item.closest('.input-control__inner')
                const icon = parent.querySelector('.input-control__icon')

                if (icon) {
                    if (item.value.length > 0) {
                        if (icon.classList.contains('input-control__icon--hidden')) {
                            icon.classList.remove('input-control__icon--hidden')
                        }
                    } else {
                        if (!icon.classList.contains('input-control__icon--hidden')) {
                            icon.classList.add('input-control__icon--hidden')
                        }
                    }
                }
            })
        })
    }
    
    // textarea
    const allTextarea = document.querySelectorAll('textarea')

    if (allTextarea) {
        allTextarea.forEach(el => {
            el.style.height = el.setAttribute('style', 'height: ' + el.scrollHeight + 'px');
            el.classList.add('auto');
            el.addEventListener('input', e => {
                el.style.height = 'auto';
                el.style.height = (el.scrollHeight) + 'px';
            });
        });
    }

    // select
    const selected = document.querySelectorAll('.select-box__selected')
    const optionsList = document.querySelectorAll('.select-box__option')
    
    if (selected) {
        selected.forEach((item) => {
            const close = () => {
                document.querySelectorAll('.select-box__container').forEach((child) => child.classList.remove('select-box__container--active'))
                document.querySelectorAll('.select-box__selected').forEach((child) => child.classList.remove('select-box__selected--active'))
            }
            const itemChecker = useItemChecker([item.parentNode.parentNode.parentNode], close)

            item.addEventListener('click', () => {
                if (item.previousElementSibling.classList.contains('select-box__container--active')) {
                    close()
                }
                else {
                    close()
                    item.previousElementSibling.classList.add('select-box__container--active')
                    item.classList.add('select-box__selected--active')
                    itemChecker.setBodyChecker()
                }
            })
        });
    }

    if (optionsList) {
        optionsList.forEach((option) => {
            option.addEventListener('click', () => {
                option.parentNode.nextElementSibling.classList.add('select-box__selected--selected')
                option.parentNode.classList.remove('select-box__container--active')
                option.parentNode.nextElementSibling.classList.remove('select-box__selected--active')
            });
        });
    }

    // sidebar
    const sidebar = document.getElementById('sidebar')
    const sidebarHide = document.querySelector('.sidebar__hide')
    const sidebarClose = document.querySelector('.sidebar__close')
    const hamburger = document.getElementById('hamburger-toggle')
    const authMenu = document.getElementById('auth-menu')

    if (sidebar && sidebarHide) {
        if (sidebarHide) {
            sidebarHide.addEventListener('click', (event) => {
                event.preventDefault()
    
                if (document.body.classList.contains('sidebar--hidden')) {
                    document.body.classList.remove('sidebar--hidden')
                    document.body.classList.add('sidebar--active')

                    setTimeout(() => {
                        document.body.classList.remove('sidebar--active')
                    }, 300)
                } else {
                    document.body.classList.add('sidebar--hidden')
                }
            })
        }
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', (event) => {
            event.preventDefault()

            if (document.body.classList.contains('sidebar--hidden')) {
                document.body.classList.remove('sidebar--hidden')
            }
        })
    }

    if (hamburger) {
        hamburger.addEventListener('click', (event) => {
            event.preventDefault()

            if (sidebar) {
                if (document.body.classList.contains('sidebar--hidden')) {
                    document.body.classList.remove('sidebar--hidden')
                    document.body.classList.add('sidebar--active')

                    setTimeout(() => {
                        document.body.classList.remove('sidebar--active')
                    }, 300)
                } else {
                    document.body.classList.add('sidebar--hidden')
                }
            }

            if (authMenu) {
                if (authMenu.classList.contains('auth-menu--active')) {
                    hamburger.classList.remove('hamburger--active')
                    authMenu.classList.remove('auth-menu--active')
                    document.body.classList.remove('scroll-disabled')
                } else {
                    hamburger.classList.add('hamburger--active')
                    authMenu.classList.add('auth-menu--active')
                    document.body.classList.add('scroll-disabled')
                }
            }
        })
    }

    // user info dropdown
    const userInfo = document.querySelector('.c-user-info')
    const userInfoDropdown = document.querySelector('.c-user-dropdown')

    if (userInfo) {
        const close = () => {
            userInfo.classList.remove('c-user-info--active')
            userInfoDropdown.classList.remove('c-user-dropdown--active')
        }
        const itemChecker = useItemChecker([userInfoDropdown.parentNode], close)

        userInfo.addEventListener('click', (event) => {
            event.preventDefault()

            if (userInfoDropdown.classList.contains('c-user-dropdown--active')) {
                close()
            } else {
                userInfo.classList.add('c-user-info--active')
                userInfoDropdown.classList.add('c-user-dropdown--active')
                itemChecker.setBodyChecker()
            }
        })
    }

    // more added files
    const addFilesMore = document.querySelectorAll('.add-files__more')

    if (addFilesMore) {
        addFilesMore.forEach((item, i) => {
            item.addEventListener('click', (event) => {
                event.preventDefault()

                const parent = item.closest('.add-files')

                if (parent.classList.contains('add-files--hidden')) {
                    parent.classList.remove('add-files--hidden')
                    item.innerHTML = 'Скрыть все файлы'
                } else {
                    parent.classList.add('add-files--hidden')
                    item.innerHTML = 'Посмотреть все файлы'
                }
            })
        })
    }

    // tabs
    const tabsItem = document.querySelectorAll('.tabs__item')

    if (tabsItem) {
        tabsItem.forEach((item, i) => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.tabs__item').forEach((child) => child.classList.remove('tabs__item--active'))
                document.querySelectorAll('.tabs__wrapper').forEach((child) => child.classList.remove('tabs__wrapper--active'))
    
                item.classList.add('tabs__item--active')
                document.querySelectorAll('.tabs__wrapper')[i].classList.add('tabs__wrapper--active')
            })
        })
    }

    // modal
    const modalBtn = document.querySelectorAll('.modal-btn')
    const modal = document.querySelectorAll('.modal')
    const modalClose = document.querySelectorAll('.modal__close')
    const modalOverlay = document.querySelectorAll('.modal__overlay')
    const modalSend = document.querySelectorAll('.modal__send')
    
    if (modal && modalBtn && modalClose && modalOverlay) {
        // modal btn
        modalBtn.forEach((item, i) => {
            item.addEventListener('click', (event) => {
                event.preventDefault();

                const modalID = item.dataset.id

                document.querySelectorAll('.modal.modal--active').forEach((child) => child.classList.remove('modal--active'))
                document.getElementById(modalID).classList.add('modal--active')
                document.body.classList.add('scroll-disabled')
            });
        });

        // modal close
        modalClose.forEach((item) => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.modal.modal--active').forEach((child) => child.classList.remove('modal--active'))
                document.body.classList.remove('scroll-disabled')
            });
        });

        // modal overlay
        modalOverlay.forEach((item) => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.modal.modal--active').forEach((child) => child.classList.remove('modal--active'))
                document.body.classList.remove('scroll-disabled')
            })
        });

        if (modalSend) {
            modalSend.forEach((item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault()

                    document.querySelectorAll('.modal.modal--active').forEach((child) => child.classList.remove('modal--active'))
                    document.getElementById('modal-success').classList.add('modal--active')

                    setTimeout(() => {
                        document.querySelectorAll('.modal.modal--active').forEach((child) => child.classList.remove('modal--active'))
                        document.body.classList.remove('scroll-disabled')
                    }, 2000)
                })
            }))
        }
    }
});