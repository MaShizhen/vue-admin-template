<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="!item.children||item.children.length===0"
    >
      <app-link v-if="item.package_url" :to="'/'+item.package_url">
        <el-menu-item :index="item.package_url" :class="{'submenu-title-noDropdown':!isNest}">
          <item
            :icon="item.icon||(item&&item.icon)"
            :title="item.menu_name"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.icon" popper-append-to-body>
      <template slot="title">
        <item v-if="item.menu_name" :icon="item.icon" :title="item.menu_name" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  }
}
</script>
