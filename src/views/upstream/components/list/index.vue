<template>
  <div class="container">
    <a-card class="general-card">
      <a-form
        :model="formModel"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="right"
      >
        <a-grid :cols="3" :collapsed="!moreSearch">
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item suffix #="{ overflow }">
            <a-form-item>
              <a-space direction="horizontal">
                <a-button type="primary" @click="search"> 查询 </a-button>
                <a-button @click="reset"> 重置 </a-button>
                <a-button type="text" @click="moreSearch = !moreSearch">
                  <template #icon>
                    <icon-double-up v-if="moreSearch" />
                    <icon-double-down v-else />
                  </template>
                  {{ moreSearch ? '收起' : '更多' }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-grid-item>
        </a-grid>
      </a-form>
      <a-divider style="margin-top: 0" />
      <a-table
        v-model:selected-keys="selectedKeys"
        row-key="upstreamId"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
      >
        <template #status="{ record }">
          <span v-if="record.status === '0'" class="circle reject"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === '0' ? '已下线' : '已上线' }}
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import {
    queryUpstreamList,
    UpstreamParams,
    UpstreamRecord,
  } from '@/api/biz/upstream';
  import { TableRowSelection } from '@arco-design/web-vue/es/table/interface';

  const rowSelection: TableRowSelection = {
    type: 'radio',
    showCheckedAll: true,
  };

  const selectedKeys = ref([]);
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true; hiddenInTable?: false };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<UpstreamRecord[]>([]);
  const formModel = ref<UpstreamRecord>({} as UpstreamRecord);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const moreSearch = ref<boolean>(false);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '上游编号',
      dataIndex: 'upstreamId',
    },
    {
      title: '上游名称',
      dataIndex: 'upstreamName',
    },
    {
      title: '上游类型',
      dataIndex: 'upstreamType',
    },
    {
      title: 'HTTP地址',
      dataIndex: 'httpAddress',
    },
    {
      title: '服务发现类型',
      dataIndex: 'discoveryType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
  ]);

  const fetchData = async (
    params: UpstreamParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryUpstreamList(params);
      renderData.value = data.records;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as UpstreamParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = {} as UpstreamRecord;
  };

  const selectedKeysHandler = () => {
    return selectedKeys.value;
  };

  defineExpose({ selectedKeysHandler });

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value = cloneColumns.value.filter(
        (item) => !item.hiddenInTable
      );
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
