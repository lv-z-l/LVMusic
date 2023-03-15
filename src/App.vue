<script>
export default {
  onLaunch: function () {
    uni.showShareMenu({ withShareTicket: false })
  },
  onShow: function () {
  },
  onHide: function () {
  }
}
</script>

<style>
/*每个页面公共css */
@import url('./style/root.css');
@import url('./style/iconfont.css');
@import url('./style/compact.css');

page,
uni-page-wrapper {
  overflow: hidden;
}

body,
page,
uni-page-body {
  background-color: var(--global-bg) !important;
  color: var(--global-color);
}

image {
  will-change: transform
}
</style>
