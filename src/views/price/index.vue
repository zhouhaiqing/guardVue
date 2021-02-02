<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate({})">{{ $t('page.common.addBtn') }}
      </el-button>
      <refresh></refresh>
    </div>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-bottom: 20px;" border @sort-change="sortChange">
      <el-table-column prop="price_temp_id" fixed label="ID" sortable="custom" width="100">
      </el-table-column>
      <el-table-column prop="price_template" width="80" :label="$t('page.drawerPrice.priceTemplate')">
      </el-table-column>
      <el-table-column prop="big_drawer_price" width="110" :label="$t('page.drawerPrice.bigDrawerPrice')">
      </el-table-column>
      <el-table-column prop="middle_drawer_price" width="110" :label="$t('page.drawerPrice.middleDrawerPrice')">
      </el-table-column>
      <el-table-column prop="small_drawer_price" width="110" :label="$t('page.drawerPrice.smallDrawerPrice')">
      </el-table-column>
      <el-table-column prop="comm_fee" width="80" :label="$t('page.drawerPrice.commFee')">
      </el-table-column>
      <el-table-column prop="ld_cabinet_fee" width="110" :label="$t('page.drawerPrice.ldCabinetFee')">
      </el-table-column>
      <el-table-column prop="md_cabinet_fee" width="110" :label="$t('page.drawerPrice.mdCabinetFee')">
      </el-table-column>
      <el-table-column prop="sd_cabinet_fee" width="110" :label="$t('page.drawerPrice.sdCabinetFee')">
      </el-table-column>
      <el-table-column prop="back_early_fee" width="130" :label="$t('page.drawerPrice.backEarlyFee')">
      </el-table-column>
      <el-table-column prop="ld_over_time_fee" width="140" :label="$t('page.drawerPrice.ldOverTimeFee')">
      </el-table-column>
      <el-table-column prop="md_over_time_fee" width="140" :label="$t('page.drawerPrice.mdOverTimeFee')">
      </el-table-column>
      <el-table-column prop="sd_over_time_fee" width="140" :label="$t('page.drawerPrice.sdOverTimeFee')">
      </el-table-column>
      <el-table-column prop="late_payment" width="120" :label="$t('page.drawerPrice.latePayment')">
      </el-table-column>
      <el-table-column prop="act_turnover_rate" width="120" :label="$t('page.drawerPrice.actTurnoverRate')">
      </el-table-column>
      <!-- <el-table-column prop="create_time" type="" :label="$t('page.common.createTime')">
        <template slot-scope="scope">
          {{ scope.row.create_time | parseTime }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="update_time" type="" :label="$t('page.common.updateTime')">
        <template slot-scope="scope">
          {{ scope.row.update_time | parseTime }}
        </template>
      </el-table-column> -->
      <el-table-column type="" fixed="right" :label="$t('page.common.actions')" width="190">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" icon="el-icon-edit">{{ $t('page.common.editBtn') }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row, scope.$index)" icon="el-icon-delete-solid">
            {{ $t('page.common.deleteBtn') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getDrawerPriceList" />

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="baseForm" :rules="rules" ref="baseForm" label-width="240px">
        <el-form-item :label="$t('page.drawerPrice.priceTemplate')" prop="price_template">
          <el-input v-model.trim="baseForm.price_template" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.bigDrawerPrice')" prop="big_drawer_price">
          <el-input-number v-model.trim="baseForm.big_drawer_price" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.middleDrawerPrice')" prop="middle_drawer_price">
          <el-input-number v-model.trim="baseForm.middle_drawer_price" :min="min" :max="max" :controls="false" :precision="2"
            class="inputNumberContent"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.smallDrawerPrice')" prop="small_drawer_price">
          <el-input-number v-model.trim="baseForm.small_drawer_price" :min="min" :max="max" :controls="false" :precision="2"
            class="inputNumberContent"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.commFee')" prop="comm_fee">
          <el-input-number v-model.trim="baseForm.comm_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.ldCabinetFee')" prop="ld_cabinet_fee">
          <el-input-number v-model.trim="baseForm.ld_cabinet_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.mdCabinetFee')" prop="md_cabinet_fee">
          <el-input-number v-model.trim="baseForm.md_cabinet_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.sdCabinetFee')" prop="sd_cabinet_fee">
          <el-input-number v-model.trim="baseForm.sd_cabinet_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.backEarlyFee')" prop="back_early_fee">
          <el-input-number v-model.trim="baseForm.back_early_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.ldOverTimeFee')" prop="ld_over_time_fee">
          <el-input-number v-model.trim="baseForm.ld_over_time_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.mdOverTimeFee')" prop="md_over_time_fee">
          <el-input-number v-model.trim="baseForm.md_over_time_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.sdOverTimeFee')" prop="sd_over_time_fee">
          <el-input-number v-model.trim="baseForm.sd_over_time_fee" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.latePayment')" prop="late_payment">
          <el-input-number v-model.trim="baseForm.late_payment" :min="min" :max="max" :controls="false" :precision="2" class="inputNumberContent">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="$t('page.drawerPrice.actTurnoverRate')" prop="act_turnover_rate">
          <el-input-number v-model.trim="baseForm.act_turnover_rate" :min="min" :max="max" :controls="false" :precision="2"
            class="inputNumberContent"></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('page.common.cancelBtn') }}</el-button>
        <el-button type="primary" @click="submitForm('baseForm', dialogType)">{{ $t('page.common.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
    drawerPriceList,
    drawerPriceDetail,
    createPriceTemp,
    updatePriceTemp,
    deletePriceTemp
} from '@/api/drawer_price'
import pagination from '@/components/Pagination'
import refresh from '@/components/Refresh'

export default {
    components: {
        refresh,
        pagination
    },
    data() {
        return {
            tableData: [],
            loading: false,
            dialogFormVisible: false,
            dialogType: '',
            title: '',
            total: 0,
            max: 99999999,
            min: 0,
            queryParams: {
                page: 1,
                limit: 20,
                idSort: 'desc'
            },
            baseForm: {
                price_temp_id: undefined,
                price_template: '',
                drawer_type: 1,
                drawer_temperature: '',
                small_drawer_price: undefined,
                middle_drawer_price: undefined,
                big_drawer_price: undefined,
                comm_fee: undefined,
                ld_cabinet_fee: undefined,
                md_cabinet_fee: undefined,
                sd_cabinet_fee: undefined,
                back_early_fee: undefined,
                ld_over_time_fee: undefined,
                md_over_time_fee: undefined,
                sd_over_time_fee: undefined,
                late_payment: undefined,
                act_turnover_rate: undefined
            },
            rules: {
                price_template: [
                    { required: true, message: this.$t('page.drawerPrice.valid.priceTemplate'), trigger: 'blur' }
                ],
                small_drawer_price: [
                    { required: true, message: this.$t('page.drawerPrice.valid.smallDrawerPrice'), trigger: 'blur' }
                ],
                middle_drawer_price: [
                    { required: true, message: this.$t('page.drawerPrice.valid.middleDrawerPrice'), trigger: 'blur' }
                ],
                big_drawer_price: [
                    { required: true, message: this.$t('page.drawerPrice.valid.bigDrawerPrice'), trigger: 'blur' }
                ],
                comm_fee: [{ required: true, message: this.$t('page.drawerPrice.valid.commFee'), trigger: 'blur' }],
                ld_cabinet_fee: [
                    { required: true, message: this.$t('page.drawerPrice.valid.ldCabinetFee'), trigger: 'blur' }
                ],
                md_cabinet_fee: [
                    { required: true, message: this.$t('page.drawerPrice.valid.mdCabinetFee'), trigger: 'blur' }
                ],
                sd_cabinet_fee: [
                    { required: true, message: this.$t('page.drawerPrice.valid.sdCabinetFee'), trigger: 'blur' }
                ],
                back_early_fee: [
                    { required: true, message: this.$t('page.drawerPrice.valid.backEarlyFee'), trigger: 'blur' }
                ],
                ld_over_time_fee: [
                    { required: true, message: this.$t('page.drawerPrice.valid.ldOverTimeFee'), trigger: 'blur' }
                ],
                md_over_time_fee: [
                    { required: true, message: this.$t('page.drawerPrice.valid.mdOverTimeFee'), trigger: 'blur' }
                ],
                sd_over_time_fee: [
                    { required: true, message: this.$t('page.drawerPrice.valid.sdOverTimeFee'), trigger: 'blur' }
                ],
                late_payment: [
                    { required: true, message: this.$t('page.drawerPrice.valid.latePayment'), trigger: 'blur' }
                ],
                act_turnover_rate: [
                    { required: true, message: this.$t('page.drawerPrice.valid.actTurnoverRate'), trigger: 'blur' }
                ]
            },
            options: []
        }
    },
    created() {
        this.getDrawerPriceList()
    },
    methods: {
        sortChange(data) {
            const { order } = data
            if (order === 'descending') {
                this.queryParams.idSort = 'desc'
            } else {
                this.queryParams.idSort = 'asc'
            }
            this.getDrawerPriceList()
        },
        getDrawerPriceList() {
            this.loading = true
            drawerPriceList(this.queryParams)
                .then(res => {
                    this.tableData = res.data.list
                    if (typeof res.data.total != 'undefined') {
                        this.total = res.data.total
                    }
                    setTimeout(() => {
                        this.loading = false
                    }, 100)
                })
                .catch(e => {})
        },
        resetForm() {
            this.baseForm = {
                price_temp_id: undefined,
                price_template: '',
                drawer_type: 1,
                drawer_temperature: '',
                small_drawer_price: undefined,
                middle_drawer_price: undefined,
                big_drawer_price: undefined,
                comm_fee: undefined,
                ld_cabinet_fee: undefined,
                md_cabinet_fee: undefined,
                sd_cabinet_fee: undefined,
                back_early_fee: undefined,
                ld_over_time_fee: undefined,
                md_over_time_fee: undefined,
                sd_over_time_fee: undefined,
                late_payment: undefined,
                act_turnover_rate: undefined
            }
        },
        handleCreate(val) {
            this.resetForm()
            this.title = this.$t('page.drawerPrice.addTemp')
            this.dialogType = 'add'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['baseForm'].clearValidate()
            })
        },
        handleUpdate(val) {
            this.resetForm()
            drawerPriceDetail(val.price_temp_id).then(res => {
                this.dialogType = 'edit'
                this.dialogFormVisible = true
                this.baseForm = res.data
                this.title = this.$t('page.common.editBtn')
                this.$nextTick(() => {
                    this.$refs['baseForm'].clearValidate()
                }).catch(e => {})
            })
        },
        submitForm(formName, dialogType) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (dialogType === 'add')
                        createPriceTemp(this.baseForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getDrawerPriceList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.createSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.drawerPrice.valid.addPriceError'))
                            })
                    else
                        updatePriceTemp(this.baseForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getDrawerPriceList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.updateSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.drawerPrice.valid.editPriceError'))
                            })
                } else {
                    this.$message.error(
                        dialogType === 'add'
                            ? this.$t('page.drawerPrice.valid.addPriceError')
                            : this.$t('page.drawerPrice.valid.editPriceError')
                    )
                    return false
                }
            })
        },
        handleDelete(val, index) {
            this.$confirm(this.$t('message.common.deleteConfirm'), this.$t('message.common.warnMsg'), {
                confirmButtonText: this.$t('page.common.confirmBtn'),
                cancelButtonText: this.$t('page.common.cancelBtn'),
                type: 'warning'
            })
                .then(() => {
                    deletePriceTemp({ price_temp_id: val.price_temp_id })
                        .then(res => {
                            const { code, msg } = res
                            if (code !== 0) {
                                this.$message.error(msg)
                            }
                            this.getDrawerPriceList()
                            this.$message({
                                message: this.$t('message.common.deleteSuccess'),
                                type: 'success'
                            })
                        })
                        .catch(err => {
                            this.$message.error(this.$t('page.drawerPrice.valid.deletePriceError'))
                            return false
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.common.cancelMessage')
                    })
                })
        }
    }
}
</script>
<style>
.width36 {
  width: 360px;
}
.inputNumberContent .el-input__inner {
  width: 360px;
  text-align: left;
}
</style>
