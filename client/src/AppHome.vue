<template>
  <div :class="containerClass" @click="onWrapperClick" id="appMainBody">
    <AppTopBar
      @menu-toggle="onMenuToggle"
      @language-changed="onLanguageChange()"
    />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
      <AppFooter />
    </div>

    <transition name="layout-mask">
      <div
        class="layout-mask p-component-overlay"
        v-if="mobileMenuActive"
      ></div>
    </transition>
  </div>
</template>

<script>
import AppTopBar from "./AppTopbar.vue";
import AppMenu from "./AppMenu.vue";
import AppFooter from "./AppFooter.vue";
import RoleService from "./modules/role/role.service";
import UserService from "./modules/user/user.service";
import currencyService from "../src/service/currencyService";

export default {
  data() {
    return {
      layoutMode: "static",
      layoutColorMode: "light",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [],
      userRoutes: [],
    };
  },
  created() {
    const { session } = this.$store.state;
    if (!(session || {}).token) {
      // got to login page
      this.$router.push("/sign_in");
      window.addEventListener("load", () => {
        if (process.env.NODE_ENV !== "production") {
          this.$router.go();
        }
      });
      return;
    }
    this.init();
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    },
  },
  methods: {
    init() {

      UserService.sessionStatus().catch(() => {
        this.gotoSignInPage();
      });

      currencyService.read().then((currencies) => {
        this.$store.commit("updateCurrencies", currencies);
      });
    },
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    onLanguageChange() {
      this.loadModules(this.connectedUser.id);
    },
    onMenuToggle() {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === "overlay") {
          if (this.mobileMenuActive === true) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === "static") {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode) {
      this.layoutMode = layoutMode;
    },
    onLayoutColorChange(layoutColorMode) {
      this.layoutColorMode = layoutColorMode;
    },
    addClass(element, className) {
      if (element.classList) element.classList.add(className);
      else element.className += " " + className;
    },
    removeClass(element, className) {
      if (element.classList) element.classList.remove(className);
      else
        element.className = element.className.replace(
          new RegExp(
            "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
            "gi"
          ),
          " "
        );
    },
    isDesktop() {
      return window.innerWidth >= 992;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === "static") return !this.staticMenuInactive;
        else if (this.layoutMode === "overlay") return this.overlayMenuActive;
      }
      return true;
    },
    loadModules(userId) {

      RoleService.loadUserModules(userId).then((modules) => {
        this.menu = [];
        modules.forEach((m) => {
          const obj = { label: this.$t(m.label), icon: m.icon, items: [] };
          m.pages.forEach((p) => {
            if (p.isTreeItem === 1) {
              obj.items.push({
                label: this.$t(p.label),
                to: `/${p.url}`,
                icon: "pi pi-file-o",
              });
            }
          });
          this.menu.push(obj);
        });
        this.userRoutes = modules;
        this.checkRoutes(this.userRoutes, this.$route.name);
      });
    },

    gotoSignInPage() {
      // got to login page
        this.$router.push("/sign_in");
        window.addEventListener("load", () => {
          if (process.env.NODE_ENV !== "production") {
            this.$router.go();
          }
        });
    },
    checkRoutes(routes, currentRoute) {
      let found = false;
      routes.forEach((r) => {
        r.pages.forEach((p) => {
          if (p.url === currentRoute) {
            found = true;
          }
        });
      });
      const allowedRoutes = ["landing"];
      if (!found && !allowedRoutes.includes(currentRoute)) {
        this.gotoSignInPage();
      }
    },
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-overlay": this.layoutMode === "overlay",
          "layout-static": this.layoutMode === "static",
          "layout-static-sidebar-inactive":
            this.staticMenuInactive && this.layoutMode === "static",
          "layout-overlay-sidebar-active":
            this.overlayMenuActive && this.layoutMode === "overlay",
          "layout-mobile-sidebar-active": this.mobileMenuActive,
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false,
          "layout-theme-light": this.$appState.theme.startsWith("saga"),
        },
      ];
    },
    logo() {
      return this.layoutColorMode === "dark"
        ? "images/logo-white.svg"
        : "images/logo.svg";
    },
  },
  mounted() {
    this.connectedUser = this.$store.state.session.user;
    this.loadModules(this.connectedUser.id);
  },
  beforeUpdate() {
    if (this.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  },
  components: {
    AppTopBar: AppTopBar,
    AppMenu: AppMenu,
    AppFooter: AppFooter,
  },
};
</script>

<style lang="scss">
@import "./App.scss";
</style>
