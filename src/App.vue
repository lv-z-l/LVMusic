<script>
export default {
  onLaunch: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  }
}
</script>

<style>
/*每个页面公共css */
@import url(./style/iconfont.css);
/**loading指令的样式 */
@import url('vue-next-directive/lib/assets/loading.css');
@import url('./style/compact.css');
@import url('./style/root.css');

uni-page-wrapper {
  overflow: hidden;
}

body,
page,
uni-page-body {
  background-color: var(--global-bg);
  color: var(--global-color);
}

image {
  will-change: transform
}
</style>
