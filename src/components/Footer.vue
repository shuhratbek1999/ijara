<template>
  <footer class="site-footer">
    <div class="container">
      <!-- Footer Menu -->
      <div class="footer-menu">
        <div
          v-for="(menu, index) in FooterMenu"
          :key="index"
          class="footer-column"
        >
          <div class="column-header" @click="toggleMenu(menu.title)">
            <h3>{{ menu.title }}</h3>
            <i class="material-icons expand-icon">keyboard_arrow_down</i>
          </div>

          <transition name="slide">
            <ul
              v-if="menu.lists && (isDesktop || activeMenu === menu.title)"
              class="column-content"
            >
              <li v-for="(list, listIndex) in menu.lists" :key="listIndex">
                <a v-if="!list.name" class="footer-link">
                  {{ list }}
                </a>
                <div v-else class="app-download">
                  <i class="material-icons">{{ list.icon }}</i>
                  <span>{{ list.name }}</span>
                </div>
              </li>

              <!-- Social Icons -->
              <div v-if="menu.icons" class="social-section">
                <h4>Elon в соцсетях</h4>
                <div class="social-icons">
                  <a
                    v-for="(item, iconIndex) in menu.icons"
                    :key="iconIndex"
                    class="social-icon"
                  >
                    <i v-if="item.icon === 'telegram'" class="material-icons"
                      >telegram</i
                    >
                    <component v-else :is="item.icon" class="ant-icon" />
                  </a>
                </div>
              </div>
            </ul>
          </transition>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-links">
          <a>Соглашение о конфиденциальности</a>
          <a>Пользовательское соглашение</a>
        </div>
        <div class="copyright">
          <p>«2024© ООО «ELON MARKET». ИНН 993941226. Все права защищены»</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  InstagramOutlined,
  FacebookOutlined,
  YoutubeOutlined,
} from "@ant-design/icons-vue";

const FooterMenu = ref([
  {
    title: "O нас",
    lists: ["Пункты выдачи", "Вакансии"],
  },
  {
    title: "Пользователям",
    lists: ["Связаться с нами", "Вопрос - Ответ"],
  },
  {
    title: "Для предпринимателей",
    lists: ["Продавайте на Uzum", "Вход для продавцов", "Открыть пункт выдачи"],
  },
  {
    title: "Скачать приложение",
    lists: [
      {
        name: "App Store",
        icon: "apple",
      },
      {
        name: "Google Play",
        icon: "smart_display",
      },
    ],
    icons: [
      {
        icon: InstagramOutlined,
      },
      {
        icon: "telegram",
      },
      {
        icon: FacebookOutlined,
      },
      {
        icon: YoutubeOutlined,
      },
    ],
  },
]);

const activeMenu = ref("");
const isDesktop = ref(window.innerWidth >= 1024);

const toggleMenu = (title) => {
  if (!isDesktop.value) {
    activeMenu.value = activeMenu.value === title ? "" : title;
  }
};

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) {
    activeMenu.value = "";
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.site-footer {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Footer Menu */
.footer-menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-column {
  padding: 0.5rem;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem 0;
  border-bottom: 1px solid #334155;
}

.column-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.column-content {
  padding: 1rem 0;
  list-style: none;
  margin: 0;
}

.footer-link {
  display: block;
  padding: 0.5rem 0;
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;
}

.footer-link:hover {
  color: #60a5fa;
}

.app-download {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  color: #cbd5e1;
  cursor: pointer;
  transition: color 0.2s ease;
}

.app-download:hover {
  color: #60a5fa;
}

.app-download i {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

/* Social Section */
.social-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #334155;
}

.social-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.social-icon i,
.social-icon .ant-icon {
  font-size: 1.25rem;
  color: #cbd5e1;
}

.social-icon:hover i,
.social-icon:hover .ant-icon {
  color: #60a5fa;
}

/* Footer Bottom */
.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #334155;
  text-align: center;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #60a5fa;
}

.copyright p {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive Design */
@media (min-width: 1024px) {
  .column-header {
    cursor: default;
    border-bottom: none;
    padding: 0 0 1rem 0;
  }

  .expand-icon {
    display: none;
  }

  .footer-menu {
    grid-template-columns: repeat(4, 1fr);
  }

  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

@media (max-width: 768px) {
  .site-footer {
    padding: 2rem 0 1rem;
  }

  .footer-menu {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .footer-column {
    border-bottom: 1px solid #334155;
  }

  .footer-column:last-child {
    border-bottom: none;
  }

  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }

  .social-icons {
    justify-content: center;
  }
}
</style>
