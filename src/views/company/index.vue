<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="queryParams.organ_name" size="mini" :placeholder="$t('page.organ.search.organName')" style="width: 200px;"
        class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="getOrganList" style="margin-left: 10px;">
        {{ $t('page.common.searchBtn') }}
      </el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate({})">{{ $t('page.common.addBtn') }}
      </el-button>
      <refresh></refresh>
    </div>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-bottom: 20px;" border @sort-change="sortChange">
      <!-- <el-table-column prop="organ_id" type="" label="ID" sortable="custom" width="60">
      </el-table-column> -->
      <el-table-column prop="logo" :label="$t('page.organ.logo')" width="80">
        <template slot-scope="scope">
          <el-image style="width: 50px; height: 50px" :src="baseHost + scope.row.logo" fit="fill"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="organ_name" :label="$t('page.organ.organName')" :width="queryParams.organ_type === 2 ? 180 : ''">
      </el-table-column>
      <el-table-column prop="short_name" :label="$t('page.organ.shortName')" :width="queryParams.organ_type === 2 ? 130 : ''">
      </el-table-column>
      <el-table-column prop="organ_no" type="" :label="$t('page.organ.organNo')" :width="queryParams.organ_type === 2 ? 130 : ''">
      </el-table-column>
      <el-table-column prop="parent_organ_name" v-if="queryParams.organ_type===2" type="" :label="$t('page.organ.parentOrgan')"
        :width="queryParams.organ_type === 2 ? 150 : ''">
      </el-table-column>
      <el-table-column prop="email" type="" :label="$t('page.organ.email')" :width="queryParams.organ_type === 2 ? 130 : ''">
      </el-table-column>
      <el-table-column prop="phone" type="" :label="$t('page.organ.phone')" width="130">
      </el-table-column>
      <el-table-column prop="status" type="" :label="$t('page.organ.status')" width="85">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="switchStatus($event, scope.row.organ_id)"
            active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="approved" type="" :label="$t('page.organ.approved')" width="85">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.approved == 1" size="mini" @click="hangleApprove(scope.row.organ_id)" icon="el-icon-check"
            class="btn">
            {{ $t('page.common.approvalBtn') }}
          </el-button>
          <span v-else>Approved</span>
        </template>
      </el-table-column>
      <el-table-column type="" :label="$t('page.common.actions')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.organ_type !== 1" @click="handleUpdate(scope.row)" class="btn" icon="el-icon-edit">
            {{ $t('page.common.editBtn') }}</el-button>
          <el-button type="danger" size="mini" v-if="$store.state.user.organ_type === 1 && scope.row.organ_type !== 1"
            @click="handleDelete(scope.row)" class="btn" icon="el-icon-delete-solid">
            {{ $t('page.common.deleteBtn') }}
          </el-button>
          <el-button type="warning" size="mini" v-if="scope.row.organ_type === 2" class="btn" icon="el-icon-edit">
            {{ $t('page.common.rechargeBtn') }}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.organ_type === 2 && scope.row.parent_id === 0" class="btn" icon="el-icon-edit"
            @click="handleAddChild(scope.row.organ_id)">
            {{ $t('page.common.addChildBtn') }}</el-button>
          <el-button type="success" size="mini" v-if="scope.row.organ_type === 2" class="btn" icon="el-icon-edit">
            {{ $t('page.common.usageBtn') }}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.organ_type === 2 && $store.state.user.organ_type === 1" class="btn"
            icon="el-icon-edit">
            {{ $t('page.common.billingBtn') }}</el-button>
          <el-button type="info" size="mini" v-if="scope.row.organ_type === 2" class="btn" icon="el-icon-edit">
            {{ $t('page.common.parcelBtn') }}</el-button>
          <el-button type="success" size="mini" v-if="scope.row.organ_type === 3" class="btn" icon="el-icon-edit">
            {{ $t('page.common.usageBtn') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getOrganList" />

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="organForm" :rules="rules" ref="organForm" label-width="180px">
        <el-form-item :label="$t('page.organ.organName')" prop="organ_name">
          <el-input v-model.trim="organForm.organ_name" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.shortName')" prop="short_name">
          <el-input v-model.trim="organForm.short_name" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.organNo')" prop="organ_no">
          <el-input v-model.trim="organForm.organ_no" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.organType')" prop="organ_type">
          <el-select v-model="organForm.organ_type" disabled :placeholder="$t('page.organ.organTypePlaceholder')" ref="organSelected">
            <el-option v-for="item in organ_types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.organ.priceTemp')" prop="price_temp_id">
          <el-select v-model="organForm.price_temp_id" clearable filterable :placeholder="$t('page.organ.priceTempPlaceholder')">
            <el-option v-for="item in options" :key="item.price_temp_id" :label="item.price_template" :value="item.price_temp_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.organ.logo')" prop="logo">
          <el-upload class="avatar-uploader" action="/admin/upload-file/upload" ref="logoUpload" :data="file" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-error="handleAvatarError">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('page.organ.phone')" prop="phone">
          <el-input v-model.trim="organForm.phone" onkeyup="value=value.replace(/[^\d]/g,'')" class="width36"
            :placeholder="$t('page.organ.phonePlaceholder')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.email')" prop="email">
          <el-input v-model.trim="organForm.email" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.address')" prop="address">
          <el-input v-model.trim="organForm.address" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.status')" prop="status">
          <el-radio-group v-model="organForm.status">
            <el-radio :label="enable">{{ $t('page.common.enable') }}</el-radio>
            <el-radio :label="disable">{{ $t('page.common.disabled' )}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('page.common.cancelBtn') }}</el-button>
        <el-button type="primary" @click="submitForm('organForm', dialogType)">{{ $t('page.common.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogChildFormVisible" width="40%">
      <el-form :model="organForm" :rules="childRules" ref="organForm" label-width="180px">
        <el-form-item :label="$t('page.organ.organName')" prop="organ_name">
          <el-input v-model.trim="organForm.organ_name" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.shortName')" prop="short_name">
          <el-input v-model.trim="organForm.short_name" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.organNo')" prop="organ_no">
          <el-input v-model.trim="organForm.organ_no" class="width36"></el-input>
        </el-form-item>
        <el-form-item :label="$t('page.organ.organType')" prop="organ_type">
          <el-select v-model="organForm.organ_type" disabled :placeholder="$t('page.organ.organTypePlaceholder')" ref="organSelected">
            <el-option v-for="item in organ_types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('page.organ.logo')" prop="logo">
          <el-upload class="avatar-uploader" action="/admin/upload-file/upload" ref="logoUpload" :data="file" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-error="handleAvatarError">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('page.organ.status')" prop="status">
          <el-radio-group v-model="organForm.status">
            <el-radio :label="enable">{{ $t('page.common.enable') }}</el-radio>
            <el-radio :label="disable">{{ $t('page.common.disabled' )}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChildFormVisible = false">{{ $t('page.common.cancelBtn') }}</el-button>
        <el-button type="primary" @click="submitForm('organForm', dialogType)">{{ $t('page.common.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
    organList,
    createOrgan,
    organDetail,
    updateOrgan,
    deleteOrgan,
    switchOrganStatus,
    approveOrgan
} from '@/api/organ'
import { drawerPriceList } from '@/api/drawer_price'
import pagination from '@/components/Pagination'
import refresh from '@/components/Refresh'
import defaultSettings from '@/settings'
const { enable, disable } = defaultSettings

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
            dialogChildFormVisible: false,
            enable: enable,
            disable: disable,
            baseHost: process.env.VUE_APP_BASE_URL,
            dialogType: '',
            title: '',
            imageUrl: '',
            total: 0,
            file: {
                file_type: 'image'
            },
            queryParams: {
                page: 1,
                limit: 20,
                organ_type: 1,
                organ_name: '',
                idSort: 'desc'
            },
            organForm: {
                organ_id: undefined,
                organ_name: '',
                short_name: '',
                organ_type: 1,
                logo: '',
                organ_no: '',
                status: enable,
                phone: '',
                email: '',
                price_temp_id: 1,
                address: ''
            },
            organ_types: [
                { label: this.$t('route.LockerOperator'), value: 1 },
                { label: this.$t('route.Courier'), value: 2 },
                { label: this.$t('route.Condo'), value: 3 }
            ],
            rules: {
                organ_name: [
                    { required: true, message: this.$t('page.organ.valid.organName'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.organ.valid.organName'), trigger: 'blur' }
                ],
                short_name: [
                    { required: true, message: this.$t('page.organ.valid.shortName'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.organ.valid.shortNameLen'), trigger: 'blur' }
                ],
                organ_no: [
                    { required: true, message: this.$t('page.organ.valid.organNo'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.organ.valid.organNoLen'), trigger: 'blur' }
                ],
                phone: [{ required: true, message: this.$t('page.organ.valid.phone'), trigger: 'blur' }],
                email: [
                    { required: true, message: this.$t('page.organ.valid.email'), trigger: 'blur' },
                    { type: 'email', message: this.$t('page.organ.valid.emailFormat'), trigger: ['blur', 'change'] }
                ],
                address: [
                    { required: true, message: this.$t('page.organ.valid.address'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.organ.valid.addressLen'), trigger: 'blur' }
                ]
            },
            childRules: {
                organ_name: [
                    { required: true, message: this.$t('page.organ.valid.organName'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.organ.valid.organName'), trigger: 'blur' }
                ],
                short_name: [
                    { required: true, message: this.$t('page.organ.valid.shortName'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.organ.valid.shortNameLen'), trigger: 'blur' }
                ],
                organ_no: [
                    { required: true, message: this.$t('page.organ.valid.organNo'), trigger: 'blur' },
                    { min: 2, max: 64, message: this.$t('page.organ.valid.organNoLen'), trigger: 'blur' }
                ]
            },
            options: []
        }
    },
    created() {
        this.getOrganList()
    },
    methods: {
        sortChange(data) {
            const { order } = data
            if (order === 'descending') {
                this.queryParams.idSort = 'desc'
            } else {
                this.queryParams.idSort = 'asc'
            }
            this.getOrganList()
        },
        getOrganList() {
            this.loading = true
            this.getOrganType()
            organList(this.queryParams)
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
        getOrganType() {
            const path_name = this.$route.name || ''
            switch (path_name) {
                case 'courier':
                    this.queryParams.organ_type = this.organForm.organ_type = 2
                    break
                case 'condo':
                    this.queryParams.organ_type = this.organForm.organ_type = 3
                    break
                default:
                    this.queryParams.organ_type = this.organForm.organ_type = 1
                    break
            }
        },
        getDrawerPeiceList() {
            drawerPriceList()
                .then(res => {
                    this.options = res.data.list
                })
                .catch(e => {})
        },
        resetForm() {
            this.organForm = {
                organ_id: undefined,
                organ_name: '',
                short_name: '',
                organ_type: this.queryParams.organ_type,
                logo: '',
                organ_no: '',
                status: enable,
                phone: '',
                email: '',
                price_temp_id: undefined,
                address: '',
                parent_id: 0
            }
        },
        handleCreate(val) {
            this.resetForm()
            this.title = this.$t('page.organ.addOrgan')
            this.dialogType = 'add'
            this.getDrawerPeiceList()
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['organForm'].clearValidate()
            })
        },
        handleAddChild(organ_id) {
            this.resetForm()
            this.organForm.parent_id = organ_id
            this.title = this.$t('page.organ.addOrgan')
            this.dialogType = 'add'
            this.dialogChildFormVisible = true
            this.$nextTick(() => {
                this.$refs['organForm'].clearValidate()
            })
        },
        handleUpdate(val) {
            this.resetForm()
            this.getDrawerPeiceList()
            organDetail(val.organ_id).then(res => {
                this.dialogType = 'edit'
                this.dialogFormVisible = true
                this.organForm = res.data
                this.imageUrl = this.baseHost + res.data.logo
                this.organForm.logo = ''
                this.title = this.$t('page.common.editBtn')
                this.$nextTick(() => {
                    this.$refs['organForm'].clearValidate()
                }).catch(e => {})
            })
        },
        submitForm(formName, dialogType) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (dialogType === 'add')
                        createOrgan(this.organForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getOrganList()
                                this.dialogFormVisible = this.dialogChildFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.createSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.organ.valid.addOrganError'))
                            })
                    else
                        updateOrgan(this.organForm)
                            .then(res => {
                                const { code, msg } = res
                                if (code !== 0) {
                                    this.$message.error(msg)
                                }
                                this.getOrganList()
                                this.dialogFormVisible = false
                                this.$message({
                                    message: this.$t('message.common.updateSuccess'),
                                    type: 'success'
                                })
                            })
                            .catch(err => {
                                this.$message.error(this.$t('page.organ.valid.editOrganError'))
                            })
                } else {
                    this.$message.error(
                        dialogType === 'add'
                            ? this.$t('page.organ.valid.addOrganError')
                            : this.$t('page.organ.valid.editOrganError')
                    )
                    return false
                }
            })
        },
        switchStatus($event, organ_id) {
            switchOrganStatus({ status: $event, organ_id: organ_id })
                .then(res => {
                    const { code, msg } = res
                    if (code !== 0) {
                        this.$message.error(msg)
                        return false
                    }
                    this.$message({
                        message: this.$t('message.common.switchSuccess'),
                        type: 'success'
                    })
                })
                .catch(e => {})
        },
        hangleApprove(organ_id) {
            approveOrgan({ organ_id, organ_id, approved: 2 }).then(res => {
                const { code, msg } = res
                if (code !== 0) {
                    this.$message.error(msg)
                    return false
                }
                this.$message({
                    message: this.$t('message.common.approveSuccess'),
                    type: 'success'
                })
                this.getOrganList()
            })
        },
        handleDelete(val) {
            this.$confirm(this.$t('message.common.deleteConfirm'), this.$t('message.common.warnMsg'), {
                confirmButtonText: this.$t('page.common.confirmBtn'),
                cancelButtonText: this.$t('page.common.cancelBtn'),
                type: 'warning'
            })
                .then(() => {
                    deleteOrgan({ organ_id: val.organ_id })
                        .then(res => {
                            const { code, msg } = res
                            if (code !== 0) {
                                this.$message.error(msg)
                            }
                            this.getOrganList()
                            this.$message({
                                message: this.$t('message.common.deleteSuccess'),
                                type: 'success'
                            })
                        })
                        .catch(err => {
                            this.$message.error(this.$t('page.organ.valid.deleteOrganError'))
                            return false
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.common.cancelMessage')
                    })
                })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw)
            this.organForm.logo = file.response.data.file
            console.log(this.organForm.logo)
            this.$message({
                message: '图片上传成功',
                type: 'success'
            })
            this.$refs.logoUpload.clearFiles() //上传成功清除列表，否则每次上传都要删掉上次上传的列表
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg'
            const isLt20M = file.size / 1024 / 1024 < 20

            // if (!isJPG) {
            //     this.$message.error('上传头像图片只能是 JPG 格式!')
            // }
            if (!isLt20M) {
                this.$message.error('上传头像图片大小不能超过 20MB!')
            }
            // return isJPG && isLt2M
            return isLt20M
        },
        handleAvatarError(err, file) {
            this.$message.error(err.msg)
        }
    }
}
</script>
<style>
.btn {
  padding: 5px 5px;
  margin-left: 0px;
}
.el-button + .el-button {
  margin-left: 5px;
}
.el-button [class*='el-icon-'] + span {
  margin-left: 0px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 13px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.width36 {
  width: 360px;
}
</style>
