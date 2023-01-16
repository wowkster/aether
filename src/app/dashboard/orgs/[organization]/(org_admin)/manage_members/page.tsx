import { BiTrash } from 'react-icons/bi'
import { GoPlus } from 'react-icons/go'
import { Button } from '../../../../../../components/Button'
import { FlexColumn, FlexRow } from '../../../../../../components/Layout'
import { PageSectionTitle, PageSubtitle, PageTitle } from '../../../../../../components/Text'

import styles from './page.module.scss'

export default function ManageMembersPage() {
    return (
        <FlexColumn gap={2}>
            <FlexColumn gap={0.5}>
                <PageTitle>Manage Members</PageTitle>
                <PageSubtitle>Invite, edit and remove organization members</PageSubtitle>
            </FlexColumn>
            <FlexColumn>
                <FlexRow justifyContent='space-between' alignItems='flex-end'>
                    <PageSectionTitle>Invites</PageSectionTitle>
                    <Button type='outlined'>
                        Create Invite <GoPlus size={16} />
                    </Button>
                </FlexRow>
                <table className={styles.table}>
                    <tr>
                        <th>Code</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Expires In</th>
                        <th>Uses</th>
                        <th>Max Uses</th>
                    </tr>
                    <tr>
                        <td>flkusdflkusdf</td>
                        <td>Adrian Wowk</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>7 days</td>
                        <td>4</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>flkusdflkusdf</td>
                        <td>Adrian Wowk</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>7 days</td>
                        <td>4</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>flkusdflkusdf</td>
                        <td>Adrian Wowk</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>7 days</td>
                        <td>4</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>flkusdflkusdf</td>
                        <td>Adrian Wowk</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>7 days</td>
                        <td>4</td>
                        <td>20</td>
                    </tr>
                </table>
            </FlexColumn>
            <FlexColumn>
                <PageSectionTitle>Members</PageSectionTitle>
                <table className={styles.table}>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Manage</th>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                    <tr>
                        <td>Adrian Wowk</td>
                        <td>Owner</td>
                        <td>1-16-2023 5:45pm</td>
                        <td>
                            <BiTrash />
                        </td>
                    </tr>
                </table>
            </FlexColumn>
        </FlexColumn>
    )
}
