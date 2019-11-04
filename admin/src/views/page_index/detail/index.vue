<template>
  <div class="main">
    <a-row v-if="detail">
      <!-- 订单信息 -->
      <div class="box-card">
        <div class="box-card-title">
          <p>订单信息</p>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">订单编号：</div>
              <div class="value">{{detail.orderId || '无'}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">客户姓名：</div>
              <div class="value">{{detail.name || '无'}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">身份证号：</div>
              <div class="value">{{detail.idCard || '无'}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">电话号码：</div>
              <div class="value">{{detail.mobile || '无'}}</div>
            </a-col>
          </a-col>
        </div>

        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">业务团队：</div>
              <div class="value">{{detail.partnerName || '无'}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">业务团队编号：</div>
              <div class="value">{{detail.partnerCode || '无'}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">贷款银行：</div>
              <div class="value">{{detail.capitalName || '无'}}</div>
            </a-col>
          </a-col>
        </div>

      </div>

      <!-- 申请结清 -->
      <div class="box-card" v-if="detail">
        <div class="box-card-title">
          <p>申请结清</p>
        </div>
        <div class="box-card-content mj-box-content">
          <a-col :span="24" class="div">
            <a-col :span="11">
              <div class="value">结清方式：</div>
              <a-select v-model="detail.companyStatus" placeholder="请选择" showSearch :options="companyStatus" style="width: 240px;"></a-select>
            </a-col>
            <a-col :span="11" v-if="detail.companyStatus == 3">
              <div class="value">减免金额：</div>
              <a-input v-model="detail.breaksCost">
                <span slot="addonAfter">元</span>
              </a-input>
            </a-col>
          </a-col>
        </div>
        <div class="box-card-content mj-box-content">
          <a-col :span="24" class="div">
            <a-col :span="24">
              <div class="value">结清备注：</div>
              <a-textarea placeholder="" v-model="detail.breaksRemark" :rows="4"/>
            </a-col>
          </a-col>
        </div>
      </div>

      
      <a-tabs defaultActiveKey="1" :tabBarGutter="0">
        <a-tab-pane tab="费用明细" key="1">
          <!-- 费用明细 -->
          <div class="box-card">
            <div class="box-card-title">
              <p>费用统计</p>
            </div>
            <div class="box-card-content">
              <a-col :span="24" class="div">
                <a-table :columns="dataList.cost" :dataSource="detail.debtCostVOList" :pagination="false">
                  <template slot="handle" slot-scope="view, item">
                    <a-tooltip placement="top" >
                      <template slot="title">
                        <span>查看详情</span>
                      </template>
                      <div class="table-handle" @click="handleCostDetail(item.id)"></div>
                    </a-tooltip>
                  </template>
                </a-table>
              </a-col>

            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="代偿明细" key="2" forceRender>
          <!-- 代偿明细 -->
          <div class="box-card">
            <div class="box-card-title">
              <p>代偿统计</p>
            </div>
            <div class="box-card-content">
              <a-col :span="24" class="div">
                <a-table :columns="dataList.compensatory" :dataSource="detail.debtRepayVOList" :pagination="false">
                  <template slot="handle" slot-scope="view,item">
                    <a-tooltip placement="top" >
                      <template slot="title">
                        <span>查看详情</span>
                      </template>
                      <div class="table-handle" @click="handleCompensatory(item.id)"></div>
                    </a-tooltip>
                  </template>
                </a-table>
              </a-col>

            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="还款记录" key="3">
          <!-- 还款记录 -->
          <div class="box-card">
            <div class="box-card-title">
              <p>客户追收记录</p>
              <div>
                <span>还款总金额：</span>
                <span>{{repaymentTotalMoney}}元</span>
              </div>
            </div>
            <div class="box-card-content">
              <a-col :span="24" class="div">
                <a-table :columns="dataList.repayment" :dataSource="detail.debtRecoverList" :pagination="false">
                  <template slot="status" slot-scope="view,item">
                    <span :style="{color: item.status == 1 ? '#108EE9' : item.status == 2 ? '#52c41a' : '#f5222d'}">{{item.statusName}}</span>
                  </template>
                  <template slot="handle" slot-scope="view, item">
                    <a-tooltip placement="top" >
                      <template slot="title">
                        <span>查看详情</span>
                      </template>
                      <div class="table-handle" @click="(choosedChaseCollectId = item.id) && handleViewDetail()"></div>
                    </a-tooltip>
                  </template>
                </a-table>
              </a-col>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>

      

    </a-row>
    <div class="footer-text" style="height:72px;">{{$store.state.app.copyRight}}</div>
    <div class="footer">
      <a-button type="primary" @click="handleSubmit" :loading="submitBtnLoading">提交</a-button>
      <!-- <a-button type="primary" ghost @click="confirmModalShow = !confirmModalShow">打回</a-button>
      <a-button type="primary" @click="accountModalShow = !accountModalShow">结清通过</a-button> -->
    </div>

    <!-- 还款明细弹框 -->
    <a-modal
      title="还款明细"
      v-model="viewModalShow"
      @ok="viewModalShow = false"
      :width="800"
    >
      <repayment-detail v-if="chaseCollectDetail" :chase-collect-detail="chaseCollectDetail"></repayment-detail>
    </a-modal>

    <!-- 费用详情弹框 -->
    <a-modal
      title="费用详情"
      v-model="costModalShow"
      @ok="costModalShow = false"
      okText="查看详情"
      :width="1000"
    >
      <div class="box-card" v-if="costDetail">
        <div class="box-card-title">
          <p>费用信息</p>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">费用编号：</div>
              <div class="value">{{costDetail.id}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">费用状态：</div>
              <div class="value">{{['','待审核','已打回','已拒绝','追收中','正常结清','减免结清'][costDetail.status*1] || ''}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">申请人：</div>
              <div class="value">{{costDetail.creatorName}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">申请时间：</div>
              <div class="value">{{costDetail.createTime}}</div>
            </a-col>
          </a-col>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">订单风险比例：</div>
              <div class="value">{{costDetail.riskPercent}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">业务团队分担金额：</div>
              <div class="value">{{costDetail.partnerCost}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">公司自担比例：</div>
              <div class="value">{{costDetail.innerRiskPercent}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">公司自担金额：</div>
              <div class="value">{{costDetail.innerCost}}</div>
            </a-col>
          </a-col>
        </div>
      </div>

      <div class="line"></div>

      <div class="box-card">
        <div class="box-card-title">
          <p>申请费用</p>
        </div>
        <div class="box-card-content">
          
        </div>
        <div class="box-card-content" v-if="costDetail">
          <a-col :span="24">
            <a-table :columns="dataList.applyCost" :dataSource="costDetail.dueCostDetailList" :pagination="false"/>
          </a-col>
        </div>
      </div>
    </a-modal>

    <!-- 代偿详情弹框 -->
    <a-modal
      title="代偿详情"
      v-model="compensatoryModalShow"
      @ok="compensatoryModalShow = false"
      okText="查看详情"
      :width="1200"
    >
      <div class="box-card" v-if="compensatoryDetail">
        <div class="box-card-title">
          <p>代偿信息</p>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">代偿编号：</div>
              <div class="value">{{compensatoryDetail.id}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">代偿状态：</div>
              <div class="value">{{['','代偿待审核','代偿待登记','代偿已打回','代偿已拒绝','代偿追收中','代偿正常结清','代偿减免结清'][compensatoryDetail.status*1] || ''}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">代偿本金：</div>
              <div class="value">{{compensatoryDetail.compensatoryAmount}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">代偿类型：</div>
              <div class="value">{{['','客户逾期','车辆回收后余额代偿结清','替客户代偿','拿车前代偿'][compensatoryDetail.type*1] || ''}}</div>
            </a-col>
          </a-col>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">代偿次数：</div>
              <div class="value">{{compensatoryDetail.compensatoryOrder}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">申请日期：</div>
              <div class="value">{{compensatoryDetail.createTime}}</div>
            </a-col>
          </a-col>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">收款账户：</div>
              <div class="value">{{compensatoryDetail.collectName}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">收款账号：</div>
              <div class="value">{{compensatoryDetail.collectCard}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">收款开户行：</div>
              <div class="value">{{compensatoryDetail.collectBank}}</div>
            </a-col>
          </a-col>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">订单风险比例：</div>
              <div class="value">{{compensatoryDetail.orderRisk}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">业务团队风险金额：</div>
              <div class="value">{{compensatoryDetail.partnerAmount}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">自担风险比例：</div>
              <div class="value">{{compensatoryDetail.selfRisk}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">自担风险金额：</div>
              <div class="value">{{compensatoryDetail.selfAmount}}</div>
            </a-col>
          </a-col>
        </div>
      </div>

      <div class="line"></div>

      <div class="box-card" v-if="compensatoryDetail">
        <div class="box-card-title">
          <p>代偿登记</p>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">代偿打款日期：</div>
              <div class="value">{{compensatoryDetail.paymentDate}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">代偿打款单号：</div>
              <div class="value">{{compensatoryDetail.paymentCode}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">经办人：</div>
              <div class="value">{{compensatoryDetail.updator}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">经办时间：</div>
              <div class="value">{{compensatoryDetail.updateTime}}</div>
            </a-col>
          </a-col>
        </div>
        <div class="box-card-content">
          <a-col :span="24" class="div">
            <a-col :span="6">
              <div class="value">打款账户：</div>
              <div class="value">{{compensatoryDetail.paymentName}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">收款账户：</div>
              <div class="value">{{compensatoryDetail.collectName}}</div>
            </a-col>
            <a-col :span="6">
              <div class="value">打款开户行：</div>
              <div class="value">{{compensatoryDetail.paymentBank}}</div>
            </a-col>
          </a-col>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import repaymentDetail from '@/views/components/repayment_detail/index'

export default {
  props: {
    id: {
      require: true
    }
  },
  components: {
    [repaymentDetail.name]: repaymentDetail
  },
  data () {
    const customRender = (text,row,index) => {
      let len = this.costDetail.dueCostDetailList.length -1;
      if (index < len) return text;
      return '';
    };
    const dataList={
      //费用统计 
      cost: [
        {title: '费用编号',dataIndex: 'id'},
        {title: '申请时间',dataIndex: 'createTime'},
        {title: '费用合计',dataIndex: 'totalCost'},
        {title: '已还费用',dataIndex: 'pay'},
        {title: '未还费用',dataIndex: 'unpay'},
        {title: '业务团队',dataIndex: 'partnerName'},
        {title: '业务团队分担费用',dataIndex: 'partnerCost'},
        {title: '费用状态',dataIndex: 'statusName'},
        {
          title: '操作',
          dataIndex: 'handle',
          align: 'center',
          scopedSlots: { customRender: 'handle' },
        }
      ], 

      // 代偿统计
      compensatory: [
        {title: '代偿编号',dataIndex: 'id'},
        {title: '代偿次数',dataIndex: 'compensatoryOrder'},
        {title: '代偿还款日期',dataIndex: 'compensatoryDate'},
        {title: '代偿金额',dataIndex: 'compensatoryAmount'},
        {title: '代偿类型',dataIndex: 'typeName'},
        {title: '代偿罚息',dataIndex: 'payPricipal'},
        {title: '已还金额',dataIndex: 'payInterest'},
        {title: '待还本金',dataIndex: 'unPayInterest'},
        {title: '待还罚息',dataIndex: 'unPayPrincipal'},
        {title: '公司状态',dataIndex: 'statusName'},
        {
          title: '操作',
          dataIndex: 'handle',
          scopedSlots: { customRender: 'handle' },
        }
      ],

      // 还款统计
      repayment:[
        {title: '还款日期',dataIndex: 'repayTime'},
        {title: '还款金额',dataIndex: 'repayment'},
        {title: '业务团队应退金额',dataIndex: 'partnerRefund'},
        {title: '还款户名',dataIndex: 'repayName'},
        {title: '还款卡号',dataIndex: 'bankCard'},
        {title: '收款户名',dataIndex: 'yollon'},
        {title: '备注',dataIndex: 'comment', width: 100},
        {
          title: '确认状态',
          dataIndex: 'statusName',
          scopedSlots: { customRender: 'status' },
        },
        {title: '登记人',dataIndex: 'creatorName'},
        {
          title: '操作',
          dataIndex: 'handle',
          scopedSlots: { customRender: 'handle' },
        }
      ],

      // 申请费用
      applyCost:[
        { 
          title: '费用项',
          dataIndex: 'type',
          customRender: (text, row, index) => {
            console.log(this,text,row,index)
            let len = this.costDetail.dueCostDetailList.length-1;
            if (index < len) return text;
            return {
              children: '费用合计',
              attrs: {
                rowSpan: 1,
              },
            };
          }
        },
        { 
          title: '当期发生', 
          dataIndex: 'cost',
          customRender: (text, row, index) => {
            console.log(this,text,row,index)
            let len = this.costDetail.dueCostDetailList.length-1;
            if (index < len) return '￥' + text;
            
            let totalMoney = this.costDetail.dueCostDetailList.map(item=>item.cost * 1).concat([0,0,0]).reduce((total,num)=>total+num).toFixed(2);
            return {
              children: '￥' + totalMoney,
              attrs: {
                rowSpan: 1,
              },
            };
          }
        },
        { 
          title: '垫付人', 
          dataIndex: 'name', 
          customRender,
        },
        { 
          title: '备注', 
          dataIndex: 'comment', 
          customRender,
        }
      ]
    };

    return {
      dataList,
      repaymentTotalMoney: '',                          // 还款总金额
      costModalShow: false,                             //费用详情弹框状态值
      costDetail: null,                                 // 费用详情
      compensatoryDetail: null,                         // 代偿明细

      chaseCollectDetail: null,                         // 查询到的记录详情
      choosedChaseCollectId: '',                        // 将要操作的记录ID
      viewModalShow:false,                              // 查看明细模态框状态值

      compensatoryModalShow: false,                     //代偿详情弹框状态值
      detail: null,

      submitBtnLoading: false,
      companyStatus: [
        { label: '-', value: 0},
        { label: '追收中', value: 1},
        { label: '正常结清', value: 2},
        { label: '减免结清', value: 3}
      ]
    }
  },
  created () {
    this.$api.getDueOrderSettlementInfo(this.id).then(res=>{
      if(res.datas){
        let detail = res.datas;
        detail.debtCostVOList = detail.debtCostVOList.map((item, index)=>{
          item.statusName = ['','待审核','已打回','已拒绝','追收中','正常结清','减免结清'][item.status*1] || '';
          item.key = index + 1;
          return item;
        });
        detail.debtRecoverList = detail.debtRecoverList.map((item, index)=>{
          item.statusName = ['','待确认','已到账','未到账'][item.status*1] || '';
          item.note = item.comment.length > 10 ? item.comment.substr(0,10) + '...' : item.comment;
          item.key = index + 1;
          return item;
        });
        detail.debtRepayVOList = detail.debtRepayVOList.map((item, index)=>{
          item.typeName = ['','客户逾期','车辆回收后余额代偿结清','替客户代偿','拿车前代偿'][item.type*1] || '';
          item.statusName = ['','代偿待审核','代偿待登记','代偿已打回','代偿已拒绝','代偿追收中','代偿正常结清','代偿减免结清'][item.status*1] || '';
          item.key = index + 1;
          return item;
        });
        if(detail.companyStatus == 4 || detail.companyStatus == 5){
          if(detail.breaksCost && detail.breaksCost != 0){
            detail.companyStatus = 3;
          }else{
            detail.companyStatus = 2;
          }
        }else{
          detail.companyStatus = detail.companyStatus * 1;
        }
        this.detail = detail;
        this.repaymentTotalMoney = detail.debtRecoverList.map(item=>item.repayment * 1).concat([0,0,0]).reduce((total,num)=>total+num).toFixed(2);
      }
    })
  },
  methods: {

    // 查看控制费用详情弹框确认按钮事件
    handleCostDetail(id){
      const hide = this.$message.loading('正在查询费用明细', 0);
      this.$api.getSettlementCostDetail(id).then(res=>{
        if(res.resultCode == '200'){
          let detail = res.datas;
          detail.dueCostDetailList = detail.dueCostDetailList.map(item=>{
            item.type = ['','支出逾期垫款','支出结清费用','支出清收费用','支出诉讼费用（含保全、仲裁、执行）','支出差旅费'][item.type*1] || '';
            return item;
          });
          if(detail.dueCostDetailList.length > 0) detail.dueCostDetailList.push({
            key: detail.dueCostDetailList.length + 1 + '',
            name: '',
            cost: 0,
            type: '',
            comment: ''
          });
          this.costDetail = detail;
          hide();
          setTimeout(()=>{
            this.costModalShow = true;
          },100);
        }else{
          hide();
          this.$message.error(res.message + ' 状态码：' + res.resultCode)
        }
      });

    },

    //代偿详情弹框显示隐藏
    handleCompensatory(id){
      const hide = this.$message.loading('正在查询费用明细', 0);
      this.$api.getCompensatoryDetail(id).then(res=>{
        if(res.resultCode == '200'){
          this.compensatoryDetail = res.datas.dueCompensatoryCustomer;
          hide();
          setTimeout(()=>{
            this.compensatoryModalShow = true;
          },100);
        }else{
          hide();
          this.$message.error(res.message + ' 状态码：' + res.resultCode)
        }
      });
    },

    //查看明细模态框确定事件
    handleViewDetail(){
      const hide = this.$message.loading('正在查询还款记录明细', 0);
      this.$api.getDueChaseCollectDetail(this.choosedChaseCollectId).then(res=>{
        hide();
        if(res.resultCode == 200){
          this.chaseCollectDetail = res.datas;
          this.viewModalShow = true;
        }else{
          this.$message.error(res.message + ' 状态码：' + res.resultCode)
        }
      }).catch(err=>{
        hide();
      })
    },

    // 提交
    handleSubmit(){
      const { detail } = this;
      if(!detail) return false;
      if(detail.companyStatus == 3){
        if(!detail.breaksCost){
          this.$message.warning('请输入减免金额');
          return false;
        }
      }
      this.submitBtnLoading = true;
      this.$api.updateDueUserInfo({
        orderId: this.id,
        companyStatus: detail.companyStatus,
        breaksCost: detail.companyStatus == 3 ? detail.breaksCost : 0,
        breaksRemark: detail.breaksRemark
      }).then(res=>{
        this.submitBtnLoading = false;
        if(res.resultCode == 200){
          this.$message.success(res.message);
        }else{
          this.$message.error(res.message + ' 状态码：' + res.resultCode)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import './index.less';
</style>