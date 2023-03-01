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
        row-key="secretId"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
      >
        <template #secretType="{ record }">
          {{
            (
              secretTypeOptions.find(
                (item) => item.value === record.secretType
              ) || { label: undefined }
            ).label
          }}
        </template>
        <template #encodingType="{ record }">
          {{
            (
              encodingTypeOptions.find(
                (item) => item.value === record.encodingType
              ) || { label: undefined }
            ).label
          }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === '0'" class="circle reject"></span>
          <span v-else class="circle pass"></span>
          {{
            (
              statusOptions.find((item) => item.value === record.status) || {
                label: undefined,
              }
            ).label
          }}
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { TableRowSelection } from '@arco-design/web-vue/es/table/interface';
  import {
    querySecretList,
    SecretParams,
    SecretRecord,
  } from '@/api/biz/secret';

  const rowSelection: TableRowSelection = {
    type: 'radio',
    showCheckedAll: true,
  };

  const selectedKeys = ref<string[]>([]);

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<SecretRecord[]>([]);
  const formModel = ref<SecretRecord>({} as SecretRecord);
  const moreSearch = ref<boolean>(false);

  const size = ref<'mini' | 'small' | 'medium' | 'large'>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '密钥编号',
      dataIndex: 'secretId',
    },
    {
      title: '密钥名称',
      dataIndex: 'secretName',
    },
    {
      title: '密钥类型',
      dataIndex: 'secretType',
      slotName: 'secretType',
    },
    {
      title: '编码类型',
      dataIndex: 'encodingType',
      slotName: 'encodingType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
  ]);
  const secretTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: '对称密钥',
      value: '1',
    },
    {
      label: '非对称密钥',
      value: '2',
    },
  ]);
  const encodingTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'Hex16',
      value: '1',
    },
    {
      label: 'Base64',
      value: '2',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: '已上线',
      value: '1',
    },
    {
      label: '已下线',
      value: '0',
    },
  ]);
  const fetchData = async (
    params: SecretParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySecretList(params);
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
    } as unknown as SecretParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = {} as SecretRecord;
  };

  const selectedKeysHandler = () => {
    return selectedKeys.value;
  };

  defineExpose({ selectedKeysHandler });
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
