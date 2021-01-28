<template>
  <div style="display: inline-block;vertical-align: middle;margin-left: 10px;">
    <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="handleRefresh">{{ $t('page.common.refresh') }}
    </el-button>
  </div>
</template>

<script>
export default {
    name: 'Refresh',
    inject: ['reload'],
    methods: {
        handleRefresh() {
            this.reload()
        }
    }
}
</script>
