import imageUrlBuilder from '@sanity/image-url';
import { Box, Flex, Stack, Text } from '@sanity/ui';
import { useMemo } from 'react';
import { MemberField, useClient, type ObjectInputProps, type ObjectMember } from 'sanity';
import { resolveBoxPadding, type BoxPaddingValue } from '../../lib/box-padding';

type FieldMember = Extract<ObjectMember, { kind: 'field' }>;

type HomepageImageValue = {
  image?: {
    asset?: { _ref?: string };
    crop?: unknown;
    hotspot?: unknown;
  };
  padding?: BoxPaddingValue | null;
};

const PREVIEW_MAX_WIDTH = 280;

function findFieldMember(members: ObjectMember[], name: string): FieldMember | undefined {
  return members.find(
    (member): member is FieldMember => member.kind === 'field' && member.name === name,
  );
}

export function TypefaceHomepageImageInput(props: ObjectInputProps) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const { members, renderField, renderInput, renderItem, renderPreview, value } = props;
  const imageMember = findFieldMember(members, 'image');
  const paddingMember = findFieldMember(members, 'padding');
  const altMember = findFieldMember(members, 'alt');
  const widthMember = findFieldMember(members, 'width');

  const docValue = (value ?? {}) as HomepageImageValue;
  const padding = resolveBoxPadding(docValue.padding);
  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const imageBuilder = useMemo(() => imageUrlBuilder(client), [client]);
  const previewUrl = docValue.image?.asset
    ? imageBuilder.image(docValue.image).width(800).fit('max').url()
    : null;

  const memberFieldProps = {
    renderField,
    renderInput,
    renderItem,
    renderPreview,
  };

  const toolbarMemberFieldProps = {
    ...memberFieldProps,
    renderField: (props: Parameters<typeof renderField>[0]) => props.children,
  };

  return (
    <Stack space={4}>
      <Box>
        <Flex align="center" justify="space-between" marginBottom={2}>
          <Text size={1} weight="semibold">
            Image
          </Text>
          {imageMember ? (
            <Box
              className={
                previewUrl
                  ? 'homepage-image-preview__toolbar'
                  : 'homepage-image-preview__toolbar homepage-image-preview__toolbar--empty'
              }
            >
              <MemberField member={imageMember} {...toolbarMemberFieldProps} />
            </Box>
          ) : null}
        </Flex>

        <Box
          className="homepage-image-preview__site"
          style={{
            backgroundColor: '#eeeeee',
            borderRadius: 5,
            padding: 12,
            maxWidth: PREVIEW_MAX_WIDTH,
          }}
        >
          <Box
            className="homepage-image-preview__box"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 5,
              padding: paddingStyle,
              transition: 'padding 0.15s ease',
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="homepage-image-preview__image"
              />
            ) : (
              <Box
                className="homepage-image-preview__empty"
                padding={3}
                style={{
                  border: '1px dashed rgb(0 0 0 / 0.2)',
                  borderRadius: 3,
                  textAlign: 'center',
                }}
              >
                <Text size={1} muted>
                  No image selected
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {paddingMember ? <MemberField member={paddingMember} {...memberFieldProps} /> : null}
      {altMember ? <MemberField member={altMember} {...memberFieldProps} /> : null}
      {widthMember ? <MemberField member={widthMember} {...memberFieldProps} /> : null}
    </Stack>
  );
}
